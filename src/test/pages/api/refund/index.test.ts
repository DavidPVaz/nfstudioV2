import type { NextApiRequest, NextApiResponse } from 'next';
import { describe, expect, it, vi, afterEach, beforeAll, afterAll } from 'vitest';
import { createMocks, type MockResponse } from 'node-mocks-http';
import RefundHandler from '@/pages/api/refund';

const TEST_REFUNDS = [
    {
        _id: '3oyRzLcufBx8vy1w14jimc3uyJJioiNaVGc3t2CysueU1dWSe93dkAKUzUdtQCHVSK6AXkr5TavE4WeDeBrRckZi',
        refunded: false,
        verified: true,
        createdAt: '2024-01-16T14:07:24.630Z',
        amount: '20619756',
        clientPublicKey: '2Jt9K7DHVmX34XDURAryKEMtk4unvYsFt9d3MmCWY8Kk',
        currency: {
            decimals: 9,
            mintAddress: '11111111111111111111111111111111',
            symbol: 'SOL'
        },
        helioTransactionId: '65a68d9c891bf6285d7d1656'
    },
    {
        _id: '2nz2WYmB9daDEh815sMqgpKrpUWySw5sxgeFXScU1kznQep6mb4P6fNis7x9NzGsDuNHaVVX3aMEpi5k6hqC1Sdr',
        refunded: false,
        verified: true,
        createdAt: '2024-01-16T14:06:21.661Z',
        amount: '20622057',
        clientPublicKey: '2Jt9K7DHVmX34XDURAryKEMtk4unvYsFt9d3MmCWY8Kk',
        currency: {
            decimals: 9,
            mintAddress: '11111111111111111111111111111111',
            symbol: 'SOL'
        },
        helioTransactionId: '65a68d5d71e9e9f5094428b3'
    }
];

const TEST_REFUND_TX_SIGNATURES = [
    {
        signature:
            '3kVVBooXtw3EBUp4bppJL4UKhyGavVUotMenGF791nKp4psc1pJ9FNDRe1FTcCUyvEttwk1V6YTsyvr51XUg57DC',
        confirmed: true
    }
];

const TEST_REFUNDED = [
    {
        associatedRefundTransactionSignature:
            '3kVVBooXtw3EBUp4bppJL4UKhyGavVUotMenGF791nKp4psc1pJ9FNDRe1FTcCUyvEttwk1V6YTsyvr51XUg57DC',
        confirmed: true,
        refundedIds: [
            '3oyRzLcufBx8vy1w14jimc3uyJJioiNaVGc3t2CysueU1dWSe93dkAKUzUdtQCHVSK6AXkr5TavE4WeDeBrRckZi',
            '2nz2WYmB9daDEh815sMqgpKrpUWySw5sxgeFXScU1kznQep6mb4P6fNis7x9NzGsDuNHaVVX3aMEpi5k6hqC1Sdr'
        ]
    }
];

const {
    queryVerifiedRefundTransactionsToProcessMock,
    updateManyRefundTransactionsMock,
    refundMock,
    getRefundedIdsFromProcessedTransactionsMock,
    captureExceptionMock
} = vi.hoisted(() => ({
    rateLimitMock: vi.fn().mockImplementation(() => Promise.resolve()),
    queryVerifiedRefundTransactionsToProcessMock: vi
        .fn()
        .mockImplementation(() => Promise.resolve(TEST_REFUNDS)),
    updateManyRefundTransactionsMock: vi.fn().mockImplementation(() => Promise.resolve()),
    refundMock: vi.fn().mockImplementation(() => Promise.resolve(TEST_REFUND_TX_SIGNATURES)),
    getRefundedIdsFromProcessedTransactionsMock: vi
        .fn()
        .mockImplementation(() => Promise.resolve(TEST_REFUNDED)),
    captureExceptionMock: vi.fn().mockImplementation(() => Promise.resolve())
}));

vi.mock('@/server/service/mongo', () => ({
    queryVerifiedRefundTransactionsToProcess: queryVerifiedRefundTransactionsToProcessMock,
    updateManyRefundTransactions: updateManyRefundTransactionsMock
}));

vi.mock('@/server/service/blockchain', () => ({
    refund: refundMock,
    getRefundedIdsFromProcessedTransactions: getRefundedIdsFromProcessedTransactionsMock
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
        const response = (await RefundHandler(
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
        const response = (await RefundHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(401);
        expect(response._getData()).toEqual('Unauthorized.');
        expect(response._isEndCalled()).toBe(true);
    });

    it('should not refund if there are no verified refund transactions to process', async () => {
        // setup
        queryVerifiedRefundTransactionsToProcessMock.mockResolvedValueOnce([]);
        const { req, res } = createMocks({
            headers: {
                authorization: 'Bearer correct'
            }
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await RefundHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(200);
        expect(response._getData()).toEqual('No refunds to process.');
        expect(response._getHeaders()['cache-control']).toEqual('no-store');
        expect(response._isEndCalled()).toBe(true);
        expect(queryVerifiedRefundTransactionsToProcessMock).toHaveBeenNthCalledWith(1);
    });

    it('should process refunds', async () => {
        // setup
        const { req, res } = createMocks({
            headers: {
                authorization: 'Bearer correct'
            }
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await RefundHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(200);
        expect(response._getJSONData()).toEqual({ refunded: TEST_REFUNDED });
        expect(response._getHeaders()['cache-control']).toEqual('no-store');
        expect(response._isEndCalled()).toBe(true);
        expect(queryVerifiedRefundTransactionsToProcessMock).toHaveBeenNthCalledWith(1);
        expect(refundMock).toHaveBeenNthCalledWith(1, { refundsToProcess: TEST_REFUNDS });
        expect(getRefundedIdsFromProcessedTransactionsMock).toHaveBeenNthCalledWith(
            1,
            TEST_REFUND_TX_SIGNATURES
        );
        TEST_REFUNDED.forEach(
            ({ associatedRefundTransactionSignature, confirmed, refundedIds }) => {
                expect(updateManyRefundTransactionsMock).toHaveBeenCalledWith({
                    ids: refundedIds,
                    newState: { refunded: confirmed, associatedRefundTransactionSignature }
                });
            }
        );
        expect(updateManyRefundTransactionsMock).toHaveBeenCalledTimes(TEST_REFUNDED.length);
    });

    it('should return 500 on error', async () => {
        // setup
        const error = new Error('cause');
        queryVerifiedRefundTransactionsToProcessMock.mockRejectedValueOnce(error);
        const { req, res } = createMocks({
            headers: {
                authorization: 'Bearer correct'
            }
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await RefundHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(500);
        expect(response._getData()).toEqual('Error processing refunds.');
        expect(response._getHeaders()['cache-control']).toEqual('no-store');
        expect(response._isEndCalled()).toBe(true);
        expect(queryVerifiedRefundTransactionsToProcessMock).toHaveBeenNthCalledWith(1);
        expect(captureExceptionMock).toHaveBeenNthCalledWith(1, error);
    });
});
