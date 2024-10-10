import { describe, expect, it, vi, afterEach } from 'vitest';
import { refund, getRefundedIdsFromProcessedTransactions } from '@/server/service/blockchain';
import { type NFStudioVerifiedRefundTransaction } from '@/server/service/helio/types';
import { PublicKey } from '@solana/web3.js';

const ConnectionMock = class {
    sendRawTransaction = vi.fn();
    confirmTransaction = vi.fn();
    getParsedTransaction = vi.fn();
};
const connectionMock = new ConnectionMock();

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
] as NFStudioVerifiedRefundTransaction[];

const MOCK_TRANSACTION_1 = {
    serialize: () => 'serialized1'
};

const MOCK_TRANSACTION_2 = {
    serialize: () => 'serialized2'
};

const TEST_REFUND_TRANSACTIONS = [MOCK_TRANSACTION_1, MOCK_TRANSACTION_2];

const TEST_REFUND_TRANSACTIONS_OUTPUT = [
    {
        signature:
            '3kVVBooXtw3EBUp4bppJL4UKhyGavVUotMenGF791nKp4psc1pJ9FNDRe1FTcCUyvEttwk1V6YTsyvr51XUg57DC',
        confirmed: true
    },
    {
        signature:
            '56hq2nzw1AXitkiL1XCwGd3L2dCvyxJxRHsNoHb4gM4V3FJGoKfEqFMFNiJnUQ6EePkpPEr4gbM7aN5YN62XiTpR',
        confirmed: false
    }
];

const { getRpcConnectionMock, createRefundTransactionsMock } = vi.hoisted(() => ({
    getRpcConnectionMock: vi.fn().mockImplementation(() => connectionMock),
    createRefundTransactionsMock: vi
        .fn()
        .mockImplementation(() => Promise.resolve(TEST_REFUND_TRANSACTIONS))
}));

vi.mock('@/server/service/blockchain/core', () => ({
    getRpcConnection: getRpcConnectionMock,
    createRefundTransactions: createRefundTransactionsMock
}));

describe('server/service/blockchain/index', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should refund NFStudio refund transactions', async () => {
        // setup
        TEST_REFUND_TRANSACTIONS_OUTPUT.forEach(output => {
            connectionMock.sendRawTransaction.mockImplementationOnce(() =>
                Promise.resolve(output.signature)
            );
        });
        connectionMock.confirmTransaction.mockImplementationOnce(() =>
            Promise.resolve({
                value: { err: null }
            })
        );
        connectionMock.confirmTransaction.mockImplementationOnce(() =>
            Promise.resolve({
                value: { err: {} }
            })
        );

        // exercise
        const result = await refund({
            refundsToProcess: TEST_REFUNDS,
            maxInstructionsPerTransaction: 1
        });

        // verify
        expect(result).toEqual(TEST_REFUND_TRANSACTIONS_OUTPUT);
        expect(getRpcConnectionMock).toHaveBeenNthCalledWith(1);
        expect(createRefundTransactionsMock).toHaveBeenNthCalledWith(1, {
            refundsToProcess: TEST_REFUNDS,
            maxInstructionsPerTransaction: 1,
            connection: connectionMock
        });

        TEST_REFUND_TRANSACTIONS.forEach(testTransaction => {
            expect(connectionMock.sendRawTransaction).toHaveBeenCalledWith(
                testTransaction.serialize(),
                {
                    preflightCommitment: 'confirmed',
                    skipPreflight: true
                }
            );
        });
        expect(connectionMock.sendRawTransaction).toHaveBeenCalledTimes(
            TEST_REFUND_TRANSACTIONS.length
        );

        TEST_REFUND_TRANSACTIONS_OUTPUT.forEach(output => {
            expect(connectionMock.confirmTransaction).toHaveBeenCalledWith(
                { signature: output.signature },
                'confirmed'
            );
        });
        expect(connectionMock.confirmTransaction).toHaveBeenCalledTimes(
            TEST_REFUND_TRANSACTIONS_OUTPUT.length
        );
    });

    it('should get the NFStudio refunded transaction ids from the processed transactions', async () => {
        // setup
        TEST_REFUND_TRANSACTIONS_OUTPUT.forEach((_, index) => {
            connectionMock.getParsedTransaction.mockImplementationOnce(() =>
                Promise.resolve({
                    transaction: {
                        message: {
                            instructions: [
                                {
                                    programId: new PublicKey(
                                        'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'
                                    ),
                                    parsed: `["${TEST_REFUNDS[index]._id}"]`
                                }
                            ]
                        }
                    }
                })
            );
        });
        const expectedResult = [
            {
                associatedRefundTransactionSignature: TEST_REFUND_TRANSACTIONS_OUTPUT[0].signature,
                confirmed: TEST_REFUND_TRANSACTIONS_OUTPUT[0].confirmed,
                refundedIds: [TEST_REFUNDS[0]._id]
            },
            {
                associatedRefundTransactionSignature: TEST_REFUND_TRANSACTIONS_OUTPUT[1].signature,
                confirmed: TEST_REFUND_TRANSACTIONS_OUTPUT[1].confirmed,
                refundedIds: [TEST_REFUNDS[1]._id]
            }
        ];

        // exercise
        const result = await getRefundedIdsFromProcessedTransactions(
            TEST_REFUND_TRANSACTIONS_OUTPUT
        );

        // verify
        expect(result).toEqual(expectedResult);
        expect(getRpcConnectionMock).toHaveBeenNthCalledWith(1);
        TEST_REFUND_TRANSACTIONS_OUTPUT.forEach(output => {
            expect(connectionMock.getParsedTransaction).toHaveBeenCalledWith(
                output.signature,
                'confirmed'
            );
        });
        expect(connectionMock.getParsedTransaction).toHaveBeenCalledTimes(
            TEST_REFUND_TRANSACTIONS_OUTPUT.length
        );
    });
});
