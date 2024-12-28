/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { NextApiRequest, NextApiResponse } from 'next';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createMocks, type MockResponse } from 'node-mocks-http';
import OrderHandler from '@/pages/api/order';
import { getOptionsMinMaxConfig } from '@/lib/utils';
import { HelioApiRequestError, TransactionValidationError } from '@/server/service/helio/core';

const { width, height, dpi } = getOptionsMinMaxConfig();
const ORDERED_IMAGE = Buffer.from('test');

const orderData = {
    src: 'https://asadasdasd.png',
    width: width.min + 10,
    height: height.min + 10,
    dpi: dpi.min + 10,
    atRight: true,
    coverStyle: false,
    mobile: true,
    logoSrc: 'url/name-logo.png',
    collection: 'collection_name',
    transactionSignature:
        '3vDBy4BDNDT56HhyBRhZBsZBM1rLYhTGi5T3HDpS4hxkE2Aw7WSQg7k1wWsBCVGdi13M3YcLBZAZw8edfBwAHFD'
};

const testValidatedTransaction = {
    id: 'id',
    refunded: false,
    verified: true,
    paylinkId: 'paylink',
    helioTransactionId: 'helioId',
    createdAt: 'iso string',
    clientPublicKey: 'public key',
    amount: '100',
    currency: 'symbol'
};

const {
    orderMock,
    captureExceptionMock,
    getCurrentScopeMock,
    insertRefundTransactionMock,
    getVerifiedNFStudioRefundTransactionMock
} = vi.hoisted(() => ({
    orderMock: vi.fn().mockImplementation(() => Promise.resolve(ORDERED_IMAGE)),
    captureExceptionMock: vi.fn(),
    getCurrentScopeMock: vi.fn(),
    insertRefundTransactionMock: vi.fn().mockImplementation(() => Promise.resolve()),
    getVerifiedNFStudioRefundTransactionMock: vi
        .fn()
        .mockImplementation(() => Promise.resolve(testValidatedTransaction))
}));

vi.mock('@/server/service/data', () => ({
    insertRefundTransaction: insertRefundTransactionMock
}));

vi.mock('@/server/service/helio', () => ({
    getVerifiedNFStudioRefundTransaction: getVerifiedNFStudioRefundTransactionMock
}));

vi.mock('@/server/service/nft-converter', () => ({
    order: orderMock
}));

vi.mock('@sentry/nextjs', () => ({
    captureException: captureExceptionMock,
    getCurrentScope: getCurrentScopeMock
}));

describe('pages/api/order/index', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should return 400 if no body', async () => {
        // setup
        const { req, res } = createMocks() as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await OrderHandler(req, res)) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
    });

    it('should return 400 if invalid body', async () => {
        // setup
        const body = { invalid: 'type' };
        const { req, res } = createMocks({
            body
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await OrderHandler(req, res)) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
    });

    it('should return 400 if no src', async () => {
        // setup
        const body = { ...orderData, src: undefined };
        const { req, res } = createMocks({
            body
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await OrderHandler(req, res)) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
    });

    it('should return 400 if invalid src', async () => {
        // setup
        const body = { ...orderData, src: '222723' };
        const { req, res } = createMocks({
            body
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await OrderHandler(req, res)) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
    });

    it('should return 400 if width is not a number', async () => {
        // setup
        const body = { ...orderData, width: 'invalid' };
        const { req, res } = createMocks({
            body
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await OrderHandler(req, res)) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
    });

    it('should return 400 if width is below min', async () => {
        // setup
        const body = { ...orderData, width: width.min - 1 };
        const { req, res } = createMocks({
            body
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await OrderHandler(req, res)) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
    });

    it('should return 400 if width is above max', async () => {
        // setup
        const body = { ...orderData, width: width.max + 1 };
        const { req, res } = createMocks({
            body
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await OrderHandler(req, res)) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
    });

    it('should return 400 if height is not a number', async () => {
        // setup
        const body = { ...orderData, height: 'invalid' };
        const { req, res } = createMocks({
            body
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await OrderHandler(req, res)) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
    });

    it('should return 400 if height is below min', async () => {
        // setup
        const body = { ...orderData, height: height.min - 1 };
        const { req, res } = createMocks({
            body
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await OrderHandler(req, res)) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
    });

    it('should return 400 if height is above max', async () => {
        // setup
        const body = { ...orderData, height: height.max + 1 };
        const { req, res } = createMocks({
            body
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await OrderHandler(req, res)) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
    });

    it('should return 400 if dpi is not a number', async () => {
        // setup
        const body = { ...orderData, dpi: 'invalid' };
        const { req, res } = createMocks({
            body
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await OrderHandler(req, res)) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
    });

    it('should return 400 if dpi is below min', async () => {
        // setup
        const body = { ...orderData, dpi: dpi.min - 1 };
        const { req, res } = createMocks({
            body
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await OrderHandler(req, res)) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
    });

    it('should return 400 if dpi is above max', async () => {
        // setup
        const body = { ...orderData, dpi: dpi.max + 1 };
        const { req, res } = createMocks({
            body
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await OrderHandler(req, res)) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
    });

    it('should return 400 if atRight is not a boolean', async () => {
        // setup
        const body = { ...orderData, atRight: 'invalid' };
        const { req, res } = createMocks({
            body
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await OrderHandler(req, res)) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
    });

    it('should return 400 if coverStyle is not a boolean', async () => {
        // setup
        const body = { ...orderData, coverStyle: 'invalid' };
        const { req, res } = createMocks({
            body
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await OrderHandler(req, res)) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
    });

    it('should return 400 if mobile is not a boolean', async () => {
        // setup
        const body = { ...orderData, mobile: 'invalid' };
        const { req, res } = createMocks({
            body
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await OrderHandler(req, res)) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
    });

    it('should return 400 if not collection', async () => {
        // setup
        const body = { ...orderData, collection: undefined };
        const { req, res } = createMocks({
            body
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await OrderHandler(req, res)) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
    });

    it('should return 400 if invalid collection', async () => {
        // setup
        const body = { ...orderData, collection: 'invalid_nam3' };
        const { req, res } = createMocks({
            body
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await OrderHandler(req, res)) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
    });

    it('should return 400 if invalid logoSrc', async () => {
        // setup
        const body = { ...orderData, logoSrc: '23232' };
        const { req, res } = createMocks({
            body
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await OrderHandler(req, res)) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
    });

    it('should return 400 if not transaction signature', async () => {
        // setup
        const body = { ...orderData, transactionSignature: undefined };
        const { req, res } = createMocks({
            body
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await OrderHandler(req, res)) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
    });

    it('should return 400 if invalid transaction signature', async () => {
        // setup
        const body = { ...orderData, transactionSignature: 'invalidTx' };
        const { req, res } = createMocks({
            body
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await OrderHandler(req, res)) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
    });

    it('should return a 401 upon attempting to validate an invalid transaction', async () => {
        // setup
        const error = new TransactionValidationError('message', 401);
        const scope = { setContext: vi.fn() };
        getCurrentScopeMock.mockImplementationOnce(() => scope);
        getVerifiedNFStudioRefundTransactionMock.mockRejectedValueOnce(error);
        const { req, res } = createMocks({
            method: 'POST',
            body: orderData
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await OrderHandler(req, res)) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(401);
        expect(response._getData()).toEqual('Unauthorized.');
        expect(response._isEndCalled()).toBe(true);

        expect(getVerifiedNFStudioRefundTransactionMock).toHaveBeenNthCalledWith(1, {
            payloadTx: orderData.transactionSignature
        });

        expect(scope.setContext).toHaveBeenNthCalledWith(1, 'transaction', {
            id: orderData.transactionSignature
        });
        expect(captureExceptionMock).toHaveBeenNthCalledWith(1, error, scope);
    });

    it('should return a 500 if validating a transaction fails with fetch error and save that as an unverified refund transaction', async () => {
        // setup
        vi.useFakeTimers();
        const error = new HelioApiRequestError('message', 500);
        const scope = { setContext: vi.fn() };
        getCurrentScopeMock.mockImplementationOnce(() => scope);
        getVerifiedNFStudioRefundTransactionMock.mockRejectedValueOnce(error);
        const expectedCreatedAt = new Date().toISOString();
        const { req, res } = createMocks({
            method: 'POST',
            body: orderData
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await OrderHandler(req, res)) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(500);
        expect(response._getData()).toEqual(
            'An unexpected error occurred while validating the transaction.'
        );
        expect(response._isEndCalled()).toBe(true);

        expect(getVerifiedNFStudioRefundTransactionMock).toHaveBeenNthCalledWith(1, {
            payloadTx: orderData.transactionSignature
        });

        expect(insertRefundTransactionMock).toHaveBeenNthCalledWith(1, {
            id: orderData.transactionSignature,
            verified: false,
            refunded: false,
            createdAt: expectedCreatedAt
        });

        expect(scope.setContext).toHaveBeenNthCalledWith(1, 'transaction', {
            id: orderData.transactionSignature
        });
        expect(captureExceptionMock).toHaveBeenNthCalledWith(1, error, scope);

        // cleanup
        vi.useRealTimers();
    });

    it('should return a 500 if validating a transaction fails with fetch error and capture error when saving refund transaction fails', async () => {
        // setup
        vi.useFakeTimers();
        const helioError = new HelioApiRequestError('message', 500);
        const dbError = new Error('message');
        const scope = { setContext: vi.fn() };
        getCurrentScopeMock.mockImplementationOnce(() => scope);
        getVerifiedNFStudioRefundTransactionMock.mockRejectedValueOnce(helioError);
        insertRefundTransactionMock.mockRejectedValueOnce(dbError);
        const expectedCreatedAt = new Date().toISOString();
        const { req, res } = createMocks({
            method: 'POST',
            body: orderData
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await OrderHandler(req, res)) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(500);
        expect(response._getData()).toEqual(
            'An unexpected error occurred while validating the transaction.'
        );
        expect(response._isEndCalled()).toBe(true);

        expect(getVerifiedNFStudioRefundTransactionMock).toHaveBeenNthCalledWith(1, {
            payloadTx: orderData.transactionSignature
        });

        expect(insertRefundTransactionMock).toHaveBeenNthCalledWith(1, {
            id: orderData.transactionSignature,
            verified: false,
            refunded: false,
            createdAt: expectedCreatedAt
        });

        expect(scope.setContext).toHaveBeenNthCalledWith(1, 'transaction', {
            id: orderData.transactionSignature
        });

        expect(captureExceptionMock).toHaveBeenNthCalledWith(1, helioError, scope);
        expect(captureExceptionMock).toHaveBeenNthCalledWith(1, dbError, scope);

        // cleanup
        vi.useRealTimers();
    });

    it('should order the image wallpaper/banner', async () => {
        // setup
        const { transactionSignature, ...orderOptions } = orderData;
        const { req, res } = createMocks({
            method: 'POST',
            body: orderData
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await OrderHandler(req, res)) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(201);
        expect(response._getData()).toEqual(ORDERED_IMAGE);
        expect(response._getHeaders()['content-type']).toEqual('application/octet-stream');
        expect(response._isEndCalled()).toBe(true);

        expect(getVerifiedNFStudioRefundTransactionMock).toHaveBeenNthCalledWith(1, {
            payloadTx: transactionSignature
        });
        expect(orderMock).toHaveBeenNthCalledWith(1, orderOptions);
    });

    it('should return 500 on order error and save that as a verified refund transaction', async () => {
        // setup
        const error = new Error('order');
        const scope = { setContext: vi.fn() };
        getCurrentScopeMock.mockImplementationOnce(() => scope);
        orderMock.mockRejectedValueOnce(error);
        const { transactionSignature, ...orderOptions } = orderData;
        const { req, res } = createMocks({
            method: 'POST',
            body: orderData
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await OrderHandler(req, res)) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(500);
        expect(response._getData()).toEqual(
            'An unexpected error occurred while creating the image.'
        );
        expect(response._isEndCalled()).toBe(true);

        expect(getVerifiedNFStudioRefundTransactionMock).toHaveBeenNthCalledWith(1, {
            payloadTx: transactionSignature
        });
        expect(orderMock).toHaveBeenNthCalledWith(1, orderOptions);

        expect(scope.setContext).toHaveBeenNthCalledWith(
            1,
            'transaction',
            testValidatedTransaction
        );

        expect(insertRefundTransactionMock).toHaveBeenNthCalledWith(1, testValidatedTransaction);

        expect(captureExceptionMock).toHaveBeenNthCalledWith(1, error, scope);
    });

    it('should return 500 on order error and capture error when saving refund transaction fails', async () => {
        // setup
        const error = new Error('order');
        const dbError = Error('message');
        const scope = { setContext: vi.fn() };
        getCurrentScopeMock.mockImplementationOnce(() => scope);
        orderMock.mockRejectedValueOnce(error);
        insertRefundTransactionMock.mockRejectedValueOnce(dbError);
        const { transactionSignature, ...orderOptions } = orderData;
        const { req, res } = createMocks({
            method: 'POST',
            body: orderData
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await OrderHandler(req, res)) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(500);
        expect(response._getData()).toEqual(
            'An unexpected error occurred while creating the image.'
        );
        expect(response._isEndCalled()).toBe(true);

        expect(getVerifiedNFStudioRefundTransactionMock).toHaveBeenNthCalledWith(1, {
            payloadTx: transactionSignature
        });
        expect(orderMock).toHaveBeenNthCalledWith(1, orderOptions);

        expect(scope.setContext).toHaveBeenNthCalledWith(
            1,
            'transaction',
            testValidatedTransaction
        );

        expect(insertRefundTransactionMock).toHaveBeenNthCalledWith(1, testValidatedTransaction);

        expect(captureExceptionMock).toHaveBeenCalledWith(dbError, scope);
        expect(captureExceptionMock).toHaveBeenCalledWith(error, scope);
        expect(captureExceptionMock).toHaveBeenCalledTimes(2);
    });
});
