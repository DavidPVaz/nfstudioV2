import type { NextApiRequest, NextApiResponse } from 'next';
import { describe, expect, it, vi, afterEach, beforeAll, afterAll } from 'vitest';
import { createMocks, type MockResponse } from 'node-mocks-http';
import DeleteInvalidRefundHandler from '@/pages/api/delete-invalid-refund';

const { deleteInvalidRefundTransactionsMock, captureExceptionMock } = vi.hoisted(() => ({
    deleteInvalidRefundTransactionsMock: vi.fn().mockImplementation(() => Promise.resolve()),
    captureExceptionMock: vi.fn().mockImplementation(() => Promise.resolve())
}));

vi.mock('@/server/service/mongo', () => ({
    deleteInvalidRefundTransactions: deleteInvalidRefundTransactionsMock
}));

vi.mock('@sentry/nextjs', () => ({
    captureException: captureExceptionMock
}));

describe('pages/api/delete-invalid-refund/index', () => {
    beforeAll(() => {
        vi.stubEnv('CRON_SECRET', 'correct');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    afterAll(() => {
        vi.unstubAllEnvs();
    });

    it('should not allow unauthorized calls if no auth header', async () => {
        // setup
        const { req, res } = createMocks() as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await DeleteInvalidRefundHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(401);
        expect(response._getData()).toEqual('Unauthorized.');
        expect(response._isEndCalled()).toBe(true);
    });

    it('should not allow unauthorized calls if auth header is wrong', async () => {
        // setup
        const { req, res } = createMocks({
            headers: {
                authorization: 'Bearer wrong'
            }
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await DeleteInvalidRefundHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(401);
        expect(response._getData()).toEqual('Unauthorized.');
        expect(response._isEndCalled()).toBe(true);
    });

    it('should delete invalid refund transactions', async () => {
        // setup
        const { req, res } = createMocks({
            headers: {
                authorization: 'Bearer correct'
            }
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await DeleteInvalidRefundHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(200);
        expect(response._getData()).toEqual('Invalid refund transactions deleted with success.');
        expect(response._getHeaders()['cache-control']).toEqual('no-store');
        expect(response._isEndCalled()).toBe(true);
        expect(deleteInvalidRefundTransactionsMock).toHaveBeenNthCalledWith(1);
    });

    it('should return 500 on error', async () => {
        // setup
        const error = new Error('delete error');
        deleteInvalidRefundTransactionsMock.mockRejectedValueOnce(error);
        const { req, res } = createMocks({
            headers: {
                authorization: 'Bearer correct'
            }
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await DeleteInvalidRefundHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(500);
        expect(response._getData()).toEqual(
            'An unexpected error occurred while deleting invalid refund transactions.'
        );
        expect(response._getHeaders()['cache-control']).toEqual('no-store');
        expect(response._isEndCalled()).toBe(true);
        expect(deleteInvalidRefundTransactionsMock).toHaveBeenNthCalledWith(1);
        expect(captureExceptionMock).toHaveBeenNthCalledWith(1, error);
    });
});
