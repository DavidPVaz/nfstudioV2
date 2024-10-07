import type { NextApiRequest, NextApiResponse } from 'next';
import { describe, expect, it, vi, afterEach, beforeAll, afterAll } from 'vitest';
import { createMocks, type MockResponse } from 'node-mocks-http';
import RefundHandler from '@/pages/api/refund';

const TEST_REFUNDS = [
    {
        _id: '3oyRzLcufBx8vy1w14jimc3uyJJioiNaVGc3t2CysueU1dWSe93dkAKUzUdtQCHVSK6AXkr5TavE4WeDeBrRckZi',
        refunded: false,
        verified: true,
        statusToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cmFuc2FjdGlvblNpZ25hdHVyZSI6IjNveVJ6TGN1ZkJ4OHZ5MXcxNGppbWMzdXlKSmlvaU5hVkdjM3QyQ3lzdWVVMWRXU2U5M2RrQUtVelVkdFFDSFZTSzZBWGtyNVRhdkU0V2VEZUJyUmNrWmkiLCJ0cmFuc2FjdGlvbklkIjoiNjVhNjhkOWM4OTFiZjYyODVkN2QxNjU2IiwiaWF0IjoxNzA1NDE0MDUxLCJleHAiOjE3MDU0MjEyNTF9.j9vse15ncRopMFehMOSLsWEhEiBhXt84eAft_8wg5kY',
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
        statusToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cmFuc2FjdGlvblNpZ25hdHVyZSI6IjJuejJXWW1COWRhREVoODE1c01xZ3BLcnBVV3lTdzVzeGdlRlhTY1Uxa3puUWVwNm1iNFA2Zk5pczd4OU56R3NEdU5IYVZWWDNhTUVwaTVrNmhxQzFTZHIiLCJ0cmFuc2FjdGlvbklkIjoiNjVhNjhkNWQ3MWU5ZTlmNTA5NDQyOGIzIiwiaWF0IjoxNzA1NDEzOTk5LCJleHAiOjE3MDU0MjExOTl9.3P8lqXxFOhPzudEIH28-DgqFbNWDm8TZY4hAbCDEkKk',
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
    //refundMock,
    //getRefundedIdsFromProcessedTransactionsMock,
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
/*
vi.mock('@/server/service/blockchain', () => ({
    refund: refundMock,
    getRefundedIdsFromProcessedTransactions: getRefundedIdsFromProcessedTransactionsMock
}));*/

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
});
