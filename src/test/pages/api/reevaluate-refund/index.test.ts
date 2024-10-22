import type { NextApiRequest, NextApiResponse } from 'next';
import { describe, expect, it, vi, afterEach, beforeAll, afterAll } from 'vitest';
import { createMocks, type MockResponse } from 'node-mocks-http';
import ReevaluateRefundHandler from '@/pages/api/reevaluate-refund';

const TEST_UNVERIFIED_REFUNDS = [
    {
        _id: '3oyRzLcufBx8vy1w14jimc3uyJJioiNaVGc3t2CysueU1dWSe93dkAKUzUdtQCHVSK6AXkr5TavE4WeDeBrRckZi',
        refunded: false,
        verified: false,
        createdAt: '2024-01-16T14:07:24.630Z'
    },
    {
        _id: '2nz2WYmB9daDEh815sMqgpKrpUWySw5sxgeFXScU1kznQep6mb4P6fNis7x9NzGsDuNHaVVX3aMEpi5k6hqC1Sdr',
        refunded: false,
        verified: false,
        createdAt: '2024-01-16T14:06:21.661Z'
    }
];

const {
    queryUnverifiedRefundTransactionsToReevaluateMock,
    updateOneRefundTransactionMock,
    reevaluateUnverifiedTransactionsMock,
    captureExceptionMock
} = vi.hoisted(() => ({
    queryUnverifiedRefundTransactionsToReevaluateMock: vi
        .fn()
        .mockImplementation(() => Promise.resolve(TEST_UNVERIFIED_REFUNDS)),
    updateOneRefundTransactionMock: vi.fn().mockImplementation(() => Promise.resolve()),
    reevaluateUnverifiedTransactionsMock: vi
        .fn()
        .mockImplementation(() => Promise.resolve(TEST_UNVERIFIED_REFUNDS)),
    captureExceptionMock: vi.fn().mockImplementation(() => Promise.resolve())
}));

vi.mock('@/server/service/mongo', () => ({
    queryUnverifiedRefundTransactionsToReevaluate:
        queryUnverifiedRefundTransactionsToReevaluateMock,
    updateOneRefundTransaction: updateOneRefundTransactionMock
}));

vi.mock('@/server/service/helio', () => ({
    reevaluateUnverifiedTransactions: reevaluateUnverifiedTransactionsMock
}));

vi.mock('@sentry/nextjs', () => ({
    captureException: captureExceptionMock
}));

describe('pages/api/reevaluate-refund/index', () => {
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
        const response = (await ReevaluateRefundHandler(
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
        const response = (await ReevaluateRefundHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(401);
        expect(response._getData()).toEqual('Unauthorized.');
        expect(response._isEndCalled()).toBe(true);
    });

    it('should not reevaluate if there are no unverified refund transactions', async () => {
        // setup
        queryUnverifiedRefundTransactionsToReevaluateMock.mockResolvedValueOnce([]);
        const { req, res } = createMocks({
            headers: {
                authorization: 'Bearer correct'
            }
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await ReevaluateRefundHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(200);
        expect(response._getData()).toEqual('No unverified refund transactions to reevaluate.');
        expect(response._getHeaders()['cache-control']).toEqual('no-store');
        expect(response._isEndCalled()).toBe(true);
        expect(queryUnverifiedRefundTransactionsToReevaluateMock).toHaveBeenNthCalledWith(1);
    });

    it('should reevaluate unverified refund transactions', async () => {
        // setup
        const { req, res } = createMocks({
            headers: {
                authorization: 'Bearer correct'
            }
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await ReevaluateRefundHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(200);
        expect(response._getData()).toEqual(
            'Unverified refund transactions reevaluated with success.'
        );
        expect(response._getHeaders()['cache-control']).toEqual('no-store');
        expect(response._isEndCalled()).toBe(true);
        expect(queryUnverifiedRefundTransactionsToReevaluateMock).toHaveBeenNthCalledWith(1);
        expect(reevaluateUnverifiedTransactionsMock).toHaveBeenNthCalledWith(
            1,
            TEST_UNVERIFIED_REFUNDS
        );
        TEST_UNVERIFIED_REFUNDS.forEach(testTransaction => {
            expect(updateOneRefundTransactionMock).toHaveBeenCalledWith(testTransaction);
        });
        expect(updateOneRefundTransactionMock).toHaveBeenCalledTimes(
            TEST_UNVERIFIED_REFUNDS.length
        );
    });

    it('should return 500 on error', async () => {
        // setup
        const error = new Error('cause');
        queryUnverifiedRefundTransactionsToReevaluateMock.mockRejectedValueOnce(error);
        // setup
        const { req, res } = createMocks({
            headers: {
                authorization: 'Bearer correct'
            }
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await ReevaluateRefundHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(500);
        expect(response._getData()).toEqual(
            'An unexpected error occurred while reevaluating unverified refund transactions.'
        );
        expect(response._getHeaders()['cache-control']).toEqual('no-store');
        expect(response._isEndCalled()).toBe(true);
        expect(queryUnverifiedRefundTransactionsToReevaluateMock).toHaveBeenCalledWith();
        expect(captureExceptionMock).toHaveBeenNthCalledWith(1, error);
    });
});
