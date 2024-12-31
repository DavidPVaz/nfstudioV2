import { describe, expect, vi, afterEach, it } from 'vitest';
import {
    getVerifiedNFStudioRefundTransaction,
    reevaluateUnverifiedTransactions
} from '@/server/service/helio';
import { HelioApiRequestError, TransactionValidationError } from '@/server/service/helio/core';
import type { NFStudioUnverifiedRefundTransaction } from '@/server/service/helio/types';

const { helioApiGETRequestMock, isWithinWindowMock } = vi.hoisted(() => ({
    helioApiGETRequestMock: vi.fn(),
    isWithinWindowMock: vi.fn()
}));

vi.mock('@/server/service/helio/core', async importOriginal => {
    const actual: object = await importOriginal();
    return {
        ...actual,
        helioApiGETRequest: helioApiGETRequestMock,
        isWithinWindow: isWithinWindowMock
    };
});

describe('server/service/helio/index', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should get a verified refund transaction', async () => {
        // setup
        const signature = 'signature';
        const expectedTransactionInfo = {
            verified: true,
            refunded: false,
            id: signature,
            paylinkId: 'paylinkId',
            helioTransactionId: 'helioId',
            createdAt: 'time',
            clientPublicKey: 'publicKey',
            amount: '18723562',
            currency: 'SOL',
            chain: 'Solana'
        };
        const fetchedParsedTransaction = {
            id: expectedTransactionInfo.helioTransactionId,
            paylinkId: expectedTransactionInfo.paylinkId,
            createdAt: expectedTransactionInfo.createdAt,
            meta: {
                amount: '18723000',
                senderPK: expectedTransactionInfo.clientPublicKey,
                transactionSignature: expectedTransactionInfo.id,
                currency: {
                    symbol: expectedTransactionInfo.currency
                }
            },
            fee: '562'
        };
        helioApiGETRequestMock.mockImplementationOnce(() =>
            Promise.resolve(fetchedParsedTransaction)
        );
        isWithinWindowMock.mockImplementationOnce(() => true);

        // exercise
        const result = await getVerifiedNFStudioRefundTransaction({
            payloadTx: signature
        });

        // verify
        expect(result).toEqual(expectedTransactionInfo);
        expect(helioApiGETRequestMock).toHaveBeenNthCalledWith(1, {
            path: `transactions/signature/${signature}`
        });
        expect(isWithinWindowMock).toHaveBeenNthCalledWith(1, {
            createdAt: fetchedParsedTransaction.createdAt,
            minutes: 3
        });
    });

    it('should bubble a HelioApiRequestError on helio api request', async () => {
        // setup
        const message = 'message';
        const code = 500;
        const signature = 'signature';
        helioApiGETRequestMock.mockRejectedValueOnce(new HelioApiRequestError(message, code));

        // exercise && verify
        await expect(
            getVerifiedNFStudioRefundTransaction({
                payloadTx: signature
            })
        ).rejects.toThrowError(new HelioApiRequestError(message, code));

        expect(helioApiGETRequestMock).toHaveBeenNthCalledWith(1, {
            path: `transactions/signature/${signature}`
        });
        expect(isWithinWindowMock).not.toHaveBeenCalled();
    });

    it('should bubble a TransactionValidationError on helio api request', async () => {
        // setup
        const message = 'message';
        const code = 401;
        const signature = 'signature';
        helioApiGETRequestMock.mockRejectedValueOnce(new TransactionValidationError(message, code));

        // exercise && verify
        await expect(
            getVerifiedNFStudioRefundTransaction({
                payloadTx: signature
            })
        ).rejects.toThrowError(new TransactionValidationError(message, code));

        expect(helioApiGETRequestMock).toHaveBeenNthCalledWith(1, {
            path: `transactions/signature/${signature}`
        });
        expect(isWithinWindowMock).not.toHaveBeenCalled();
    });

    it('should throw a TransactionValidationError if transaction is not within window', async () => {
        // setup
        const signature = 'signature';
        const expectedTransactionInfo = {
            verified: true,
            refunded: false,
            id: signature,
            paylinkId: 'paylinkId',
            helioTransactionId: 'helioId',
            createdAt: 'time',
            clientPublicKey: 'publicKey',
            amount: '18724562',
            currency: 'SOL',
            chain: 'Solana'
        };
        const fetchedParsedTransaction = {
            id: expectedTransactionInfo.helioTransactionId,
            paylinkId: expectedTransactionInfo.paylinkId,
            createdAt: expectedTransactionInfo.createdAt,
            meta: {
                amount: '18724000',
                senderPK: expectedTransactionInfo.clientPublicKey,
                transactionSignature: expectedTransactionInfo.id,
                currency: {
                    symbol: expectedTransactionInfo.currency
                }
            },
            fee: '562'
        };
        helioApiGETRequestMock.mockImplementationOnce(() =>
            Promise.resolve(fetchedParsedTransaction)
        );
        isWithinWindowMock.mockImplementationOnce(() => false);

        // exercise && verify
        await expect(
            getVerifiedNFStudioRefundTransaction({
                payloadTx: signature
            })
        ).rejects.toThrowError(
            new TransactionValidationError(`Transaction ${signature} is not valid.`, 401)
        );

        expect(helioApiGETRequestMock).toHaveBeenNthCalledWith(1, {
            path: `transactions/signature/${signature}`
        });
        expect(isWithinWindowMock).toHaveBeenNthCalledWith(1, {
            createdAt: fetchedParsedTransaction.createdAt,
            minutes: 3
        });
    });

    it('should reevaluate unverified refund transactions', async () => {
        // setup
        const unverifiedTransaction1 = { id: '1' };
        const unverifiedTransaction2 = { id: '2' };
        const unverifiedTransaction3 = { id: '3' };
        const unverifiedTransaction4 = { id: '4' };
        const refundTransaction = {
            verified: true,
            refunded: false,
            id: unverifiedTransaction1.id,
            paylinkId: 'paylinkId',
            helioTransactionId: 'helioId',
            createdAt: 'time',
            clientPublicKey: 'publicKey',
            amount: '18723562',
            currency: 'SOL',
            chain: 'Solana'
        };
        const fetchedParsedTransaction = {
            id: refundTransaction.helioTransactionId,
            paylinkId: refundTransaction.paylinkId,
            createdAt: refundTransaction.createdAt,
            meta: {
                amount: '18723000',
                senderPK: refundTransaction.clientPublicKey,
                transactionSignature: refundTransaction.id,
                currency: {
                    symbol: refundTransaction.currency
                }
            },
            fee: '562'
        };

        const unverifiedRefundTransactions = [
            unverifiedTransaction1,
            unverifiedTransaction2,
            unverifiedTransaction3,
            unverifiedTransaction4
        ] as NFStudioUnverifiedRefundTransaction[];

        const expectedReevaluation = [
            refundTransaction,
            { ...unverifiedTransaction2, canDelete: true },
            { ...unverifiedTransaction3, canDelete: true },
            unverifiedTransaction4
        ];

        helioApiGETRequestMock.mockImplementationOnce(() =>
            Promise.resolve(fetchedParsedTransaction)
        );
        helioApiGETRequestMock.mockRejectedValueOnce(
            new TransactionValidationError('message', 401)
        );
        helioApiGETRequestMock.mockRejectedValueOnce(
            new TransactionValidationError('message', 401)
        );
        helioApiGETRequestMock.mockRejectedValueOnce(new HelioApiRequestError('message', 500));

        // exercise
        const result = await reevaluateUnverifiedTransactions(unverifiedRefundTransactions);

        // verify
        expect(result).toEqual(expectedReevaluation);
        unverifiedRefundTransactions.forEach(transaction => {
            expect(helioApiGETRequestMock).toHaveBeenCalledWith({
                path: `transactions/signature/${transaction.id}`
            });
        });
        expect(helioApiGETRequestMock).toHaveBeenCalledTimes(unverifiedRefundTransactions.length);
        expect(isWithinWindowMock).not.toHaveBeenCalled();
    });
});
