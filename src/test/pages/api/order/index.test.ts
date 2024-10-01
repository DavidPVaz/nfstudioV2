/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { NextApiRequest, NextApiResponse } from 'next';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createMocks, type MockResponse } from 'node-mocks-http';
import OrderHandler from '@/pages/api/order';
import { getOptionsMinMaxConfig } from '@/lib/utils';

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
    statusToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cmFuc2FjdGlvblNpZ25hdHVyZSI6IjN2REJ5NEJETkRUNTZIaHlCUmhaQnNaQk0xckxZaFRHaTVUM0hEcFM0aHhrRTJBdzdXU1FnN2sxd1dzQkNWR2RpMTNNM1ljTEJaQVp3OGVkZkJ3QUhGRCIsInRyYW5zYWN0aW9uSWQiOiI2NmZjMTFiNmEwZGNlMTQ1MTk4N2ZjMzkiLCJpYXQiOjE3Mjc3OTU2NDEsImV4cCI6MTcyNzgwMjg0MX0.h-n3ZYoMxHNUkAb1NtMr9N7OTkTb_H91puHzt7Pl1Bc',
    transactionSignature:
        '3vDBy4BDNDT56HhyBRhZBsZBM1rLYhTGi5T3HDpS4hxkE2Aw7WSQg7k1wWsBCVGdi13M3YcLBZAZw8edfBwAHFD'
};

const { orderMock, captureExceptionMock } = vi.hoisted(() => ({
    orderMock: vi.fn().mockImplementation(() => Promise.resolve(ORDERED_IMAGE)),
    captureExceptionMock: vi.fn()
}));

vi.mock('@/server/service/nft-converter', () => ({
    order: orderMock
}));

vi.mock('@sentry/nextjs', () => ({
    captureException: captureExceptionMock
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
        expect(orderMock).not.toHaveBeenCalled();
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
        expect(orderMock).not.toHaveBeenCalled();
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
        expect(orderMock).not.toHaveBeenCalled();
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
        expect(orderMock).not.toHaveBeenCalled();
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
        expect(orderMock).not.toHaveBeenCalled();
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
        expect(orderMock).not.toHaveBeenCalled();
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
        expect(orderMock).not.toHaveBeenCalled();
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
        expect(orderMock).not.toHaveBeenCalled();
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
        expect(orderMock).not.toHaveBeenCalled();
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
        expect(orderMock).not.toHaveBeenCalled();
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
        expect(orderMock).not.toHaveBeenCalled();
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
        expect(orderMock).not.toHaveBeenCalled();
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
        expect(orderMock).not.toHaveBeenCalled();
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
        expect(orderMock).not.toHaveBeenCalled();
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
        expect(orderMock).not.toHaveBeenCalled();
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
        expect(orderMock).not.toHaveBeenCalled();
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
        expect(orderMock).not.toHaveBeenCalled();
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
        expect(orderMock).not.toHaveBeenCalled();
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
        expect(orderMock).not.toHaveBeenCalled();
    });

    it('should return 400 if not status token', async () => {
        // setup
        const body = { ...orderData, statusToken: undefined };
        const { req, res } = createMocks({
            body
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await OrderHandler(req, res)) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(orderMock).not.toHaveBeenCalled();
    });

    it('should return 400 if invalid status token', async () => {
        // setup
        const body = { ...orderData, statusToken: 'thisIsNotAValidToken' };
        const { req, res } = createMocks({
            body
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await OrderHandler(req, res)) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(orderMock).not.toHaveBeenCalled();
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
        expect(orderMock).not.toHaveBeenCalled();
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
        expect(orderMock).not.toHaveBeenCalled();
    });
});
