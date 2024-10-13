import { describe, expect, vi, afterEach, it } from 'vitest';
import {
    queryCollectionsData,
    queryMetadata,
    insertRefundTransaction,
    queryVerifiedRefundTransactionsToProcess,
    queryUnverifiedRefundTransactionsToReevaluate,
    updateManyRefundTransactions,
    updateOneRefundTransaction,
    deleteInvalidRefundTransactions
} from '@/server/service/mongo';
import { MongoDataApiRequestError } from '@/server/service/mongo/core';
import type { NFStudioUnverifiedRefundTransaction } from '@/server/service/helio/types';

const { mongoApiRequestMock } = vi.hoisted(() => ({
    mongoApiRequestMock: vi.fn()
}));

vi.mock('@/server/service/mongo/core', async importOriginal => {
    const actual: object = await importOriginal();
    return {
        ...actual,
        mongoApiRequest: mongoApiRequestMock
    };
});

const documents = [
    { _id: '1', presentation: 'src1' },
    { _id: '2', presentation: 'src2' }
];

describe('server/service/mongo/index', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should query collections data with defaults', async () => {
        // setup
        const expectedOptions = {
            action: 'find',
            data: {
                database: 'collections',
                collection: 'configurations',
                filter: {},
                projection: {},
                sort: {
                    createdAt: -1
                },
                limit: null
            }
        };
        mongoApiRequestMock.mockImplementationOnce(() => Promise.resolve({ documents }));

        // exercise
        const collections = await queryCollectionsData();

        // verify
        expect(collections).toEqual(documents);
        expect(mongoApiRequestMock).toHaveBeenNthCalledWith(1, expectedOptions);
    });

    it('should query collections data', async () => {
        // setup
        const filter = { some: { eq: true } };
        const projection = { config: 1 };
        const limit = 2;
        const expectedOptions = {
            action: 'find',
            data: {
                database: 'collections',
                collection: 'configurations',
                filter,
                projection,
                sort: {
                    createdAt: -1
                },
                limit
            }
        };
        mongoApiRequestMock.mockImplementationOnce(() => Promise.resolve({ documents }));

        // exercise
        const collections = await queryCollectionsData({ filter, projection, limit });

        // verify
        expect(collections).toEqual(documents);
        expect(mongoApiRequestMock).toHaveBeenNthCalledWith(1, expectedOptions);
    });

    it('should query collections data and set the default active filter if production environment', async () => {
        // setup
        vi.stubEnv('VERCEL_ENV', 'production');
        const filter = { some: { eq: false } };
        const projection = { config: 1 };
        const limit = 10;
        const expectedOptions = {
            action: 'find',
            data: {
                database: 'collections',
                collection: 'configurations',
                filter: { active: { $eq: true }, ...filter },
                projection,
                sort: {
                    createdAt: -1
                },
                limit
            }
        };
        mongoApiRequestMock.mockImplementationOnce(() => Promise.resolve({ documents }));

        // exercise
        const collections = await queryCollectionsData({ filter, projection, limit });

        // verify
        expect(collections).toEqual(documents);
        expect(mongoApiRequestMock).toHaveBeenNthCalledWith(1, expectedOptions);

        // cleanup
        vi.unstubAllEnvs();
    });

    it('should bubble errors when querying collection data', async () => {
        // setup
        const message = 'message';
        const code = 401;
        mongoApiRequestMock.mockRejectedValueOnce(new MongoDataApiRequestError(message, code));

        // exercise && verify
        await expect(queryCollectionsData()).rejects.toThrowError(
            new MongoDataApiRequestError(message, code)
        );
    });

    it('should query a collection metadata', async () => {
        // setup
        const collection = 'Name';
        const ids = [1, 2, 3];
        const expectedOptions = {
            action: 'find',
            data: {
                database: 'metadata',
                collection: 'name',
                filter: {
                    _id: {
                        $in: ids
                    }
                }
            }
        };
        mongoApiRequestMock.mockImplementationOnce(() => Promise.resolve({ documents }));

        // exercise
        const metadata = await queryMetadata({ collection, ids });

        // verify
        expect(metadata).toEqual(documents);
        expect(mongoApiRequestMock).toHaveBeenNthCalledWith(1, expectedOptions);
    });

    it('should bubble errors when querying collection metadata', async () => {
        // setup
        const message = 'message';
        const code = 401;
        const collection = 'Name';
        const ids = [1, 2, 3];
        mongoApiRequestMock.mockRejectedValueOnce(new MongoDataApiRequestError(message, code));

        // exercise && verify
        await expect(queryMetadata({ collection, ids })).rejects.toThrowError(
            new MongoDataApiRequestError(message, code)
        );
    });

    it('should insert a refund transaction', async () => {
        // setup
        const transaction = { data: 'data' } as unknown as NFStudioUnverifiedRefundTransaction;
        const expectedOptions = {
            action: 'insertOne',
            data: {
                database: 'refunds',
                collection: 'transactions-staging',
                document: transaction
            }
        };
        const response = { response: 'response' };
        mongoApiRequestMock.mockImplementationOnce(() => Promise.resolve(response));

        // exercise
        const result = await insertRefundTransaction(transaction);

        // verify
        expect(result).toEqual(response);
        expect(mongoApiRequestMock).toHaveBeenNthCalledWith(1, expectedOptions);
    });

    it('should insert a refund transaction to the correct collection if in production environment', async () => {
        // setup
        vi.stubEnv('VERCEL_ENV', 'production');
        const transaction = { data: 'data' } as unknown as NFStudioUnverifiedRefundTransaction;
        const expectedOptions = {
            action: 'insertOne',
            data: {
                database: 'refunds',
                collection: 'transactions',
                document: transaction
            }
        };
        const response = { response: 'response' };
        mongoApiRequestMock.mockImplementationOnce(() => Promise.resolve(response));

        // exercise
        const result = await insertRefundTransaction(transaction);

        // verify
        expect(result).toEqual(response);
        expect(mongoApiRequestMock).toHaveBeenNthCalledWith(1, expectedOptions);

        // cleanup
        vi.unstubAllEnvs();
    });

    it('should bubble errors when inserting refund transactions', async () => {
        // setup
        const message = 'message';
        const code = 401;
        const transaction = { data: 'data' } as unknown as NFStudioUnverifiedRefundTransaction;
        mongoApiRequestMock.mockRejectedValueOnce(new MongoDataApiRequestError(message, code));

        // exercise && verify
        await expect(insertRefundTransaction(transaction)).rejects.toThrowError(
            new MongoDataApiRequestError(message, code)
        );
    });

    it('should query verified refund transactions', async () => {
        // setup
        const expectedOptions = {
            action: 'find',
            data: {
                database: 'refunds',
                collection: 'transactions-staging',
                filter: {
                    verified: { $eq: true },
                    refunded: { $eq: false },
                    associatedRefundTransactionSignature: { $ne: true }
                },
                sort: {
                    createdAt: -1
                }
            }
        };
        mongoApiRequestMock.mockImplementationOnce(() => Promise.resolve({ documents }));

        // exercise
        const transactions = await queryVerifiedRefundTransactionsToProcess();

        // verify
        expect(transactions).toEqual(documents);
        expect(mongoApiRequestMock).toHaveBeenNthCalledWith(1, expectedOptions);
    });

    it('should query verified refund transactions in the correct collection if in production environment', async () => {
        // setup
        vi.stubEnv('VERCEL_ENV', 'production');
        const expectedOptions = {
            action: 'find',
            data: {
                database: 'refunds',
                collection: 'transactions',
                filter: {
                    verified: { $eq: true },
                    refunded: { $eq: false },
                    associatedRefundTransactionSignature: { $ne: true }
                },
                sort: {
                    createdAt: -1
                }
            }
        };
        mongoApiRequestMock.mockImplementationOnce(() => Promise.resolve({ documents }));

        // exercise
        const transactions = await queryVerifiedRefundTransactionsToProcess();

        // verify
        expect(transactions).toEqual(documents);
        expect(mongoApiRequestMock).toHaveBeenNthCalledWith(1, expectedOptions);

        // cleanup
        vi.unstubAllEnvs();
    });

    it('should bubble errors when querying verified refund transactions', async () => {
        // setup
        const message = 'message';
        const code = 401;
        mongoApiRequestMock.mockRejectedValueOnce(new MongoDataApiRequestError(message, code));

        // exercise && verify
        await expect(queryVerifiedRefundTransactionsToProcess()).rejects.toThrowError(
            new MongoDataApiRequestError(message, code)
        );
    });

    it('should query unverified refund transactions', async () => {
        // setup
        const expectedOptions = {
            action: 'find',
            data: {
                database: 'refunds',
                collection: 'transactions-staging',
                filter: { verified: { $eq: false }, canDelete: { $ne: true } },
                sort: {
                    createdAt: -1
                }
            }
        };
        mongoApiRequestMock.mockImplementationOnce(() => Promise.resolve({ documents }));

        // exercise
        const transactions = await queryUnverifiedRefundTransactionsToReevaluate();

        // verify
        expect(transactions).toEqual(documents);
        expect(mongoApiRequestMock).toHaveBeenNthCalledWith(1, expectedOptions);
    });

    it('should query unverified refund transactions in the correct collection if in production environment', async () => {
        // setup
        vi.stubEnv('VERCEL_ENV', 'production');
        const expectedOptions = {
            action: 'find',
            data: {
                database: 'refunds',
                collection: 'transactions',
                filter: { verified: { $eq: false }, canDelete: { $ne: true } },
                sort: {
                    createdAt: -1
                }
            }
        };
        mongoApiRequestMock.mockImplementationOnce(() => Promise.resolve({ documents }));

        // exercise
        const transactions = await queryUnverifiedRefundTransactionsToReevaluate();

        // verify
        expect(transactions).toEqual(documents);
        expect(mongoApiRequestMock).toHaveBeenNthCalledWith(1, expectedOptions);

        // cleanup
        vi.unstubAllEnvs();
    });

    it('should bubble errors when querying unverified refund transactions', async () => {
        // setup
        const message = 'message';
        const code = 401;
        mongoApiRequestMock.mockRejectedValueOnce(new MongoDataApiRequestError(message, code));

        // exercise && verify
        await expect(queryUnverifiedRefundTransactionsToReevaluate()).rejects.toThrowError(
            new MongoDataApiRequestError(message, code)
        );
    });

    it('should update many refund transactions', async () => {
        // setup
        const ids = ['1', '2', '3', '4', '5'];
        const newState = { verified: true };
        const expectedOptions = {
            action: 'updateMany',
            data: {
                database: 'refunds',
                collection: 'transactions-staging',
                filter: { _id: { $in: ids } },
                update: {
                    $set: newState
                }
            }
        };
        const response = { response: 'response' };
        mongoApiRequestMock.mockImplementationOnce(() => Promise.resolve(response));

        // exercise
        const result = await updateManyRefundTransactions({ ids, newState });

        // verify
        expect(result).toEqual(response);
        expect(mongoApiRequestMock).toHaveBeenNthCalledWith(1, expectedOptions);
    });

    it('should update many refund transactions in the correct collection if in production environment', async () => {
        // setup
        vi.stubEnv('VERCEL_ENV', 'production');
        const ids = ['1', '2', '3', '4', '5'];
        const newState = { verified: true };
        const expectedOptions = {
            action: 'updateMany',
            data: {
                database: 'refunds',
                collection: 'transactions',
                filter: { _id: { $in: ids } },
                update: {
                    $set: newState
                }
            }
        };
        const response = { response: 'response' };
        mongoApiRequestMock.mockImplementationOnce(() => Promise.resolve(response));

        // exercise
        const result = await updateManyRefundTransactions({ ids, newState });

        // verify
        expect(result).toEqual(response);
        expect(mongoApiRequestMock).toHaveBeenNthCalledWith(1, expectedOptions);

        // cleanup
        vi.unstubAllEnvs();
    });

    it('should bubble errors when updating many refund transactions', async () => {
        // setup
        const message = 'message';
        const code = 401;
        const ids = ['1', '2', '3', '4', '5'];
        const newState = { verified: true };
        mongoApiRequestMock.mockRejectedValueOnce(new MongoDataApiRequestError(message, code));

        // exercise && verify
        await expect(updateManyRefundTransactions({ ids, newState })).rejects.toThrowError(
            new MongoDataApiRequestError(message, code)
        );
    });

    it('should update one refund transaction', async () => {
        // setup
        const newState = { verified: false };
        const transaction = {
            _id: '1',
            ...newState
        } as unknown as NFStudioUnverifiedRefundTransaction;
        const expectedOptions = {
            action: 'updateOne',
            data: {
                database: 'refunds',
                collection: 'transactions-staging',
                filter: { _id: { $eq: transaction._id } },
                update: {
                    $set: newState
                }
            }
        };
        const response = { response: 'response' };
        mongoApiRequestMock.mockImplementationOnce(() => Promise.resolve(response));

        // exercise
        const result = await updateOneRefundTransaction(transaction);

        // verify
        expect(result).toEqual(response);
        expect(mongoApiRequestMock).toHaveBeenNthCalledWith(1, expectedOptions);
    });

    it('should update one refund transaction in the correct collection if in production environment', async () => {
        // setup
        vi.stubEnv('VERCEL_ENV', 'production');
        const newState = { verified: false };
        const transaction = {
            _id: '1',
            ...newState
        } as unknown as NFStudioUnverifiedRefundTransaction;
        const expectedOptions = {
            action: 'updateOne',
            data: {
                database: 'refunds',
                collection: 'transactions',
                filter: { _id: { $eq: transaction._id } },
                update: {
                    $set: newState
                }
            }
        };
        const response = { response: 'response' };
        mongoApiRequestMock.mockImplementationOnce(() => Promise.resolve(response));

        // exercise
        const result = await updateOneRefundTransaction(transaction);

        // verify
        expect(result).toEqual(response);
        expect(mongoApiRequestMock).toHaveBeenNthCalledWith(1, expectedOptions);

        // cleanup
        vi.unstubAllEnvs();
    });

    it('should bubble errors when updating one refund transaction', async () => {
        // setup
        const message = 'message';
        const code = 401;
        const transaction = {} as unknown as NFStudioUnverifiedRefundTransaction;
        mongoApiRequestMock.mockRejectedValueOnce(new MongoDataApiRequestError(message, code));

        // exercise && verify
        await expect(updateOneRefundTransaction(transaction)).rejects.toThrowError(
            new MongoDataApiRequestError(message, code)
        );
    });

    it('should delete invalid refund transactions', async () => {
        // setup
        const expectedOptions = {
            action: 'deleteMany',
            data: {
                database: 'refunds',
                collection: 'transactions-staging',
                filter: { canDelete: { $eq: true } }
            }
        };
        const response = { response: 'response' };
        mongoApiRequestMock.mockImplementationOnce(() => Promise.resolve(response));

        // exercise
        const result = await deleteInvalidRefundTransactions();

        // verify
        expect(result).toEqual(response);
        expect(mongoApiRequestMock).toHaveBeenNthCalledWith(1, expectedOptions);
    });

    it('should delete invalid refund transaction from the correct collection if in production environment', async () => {
        // setup
        vi.stubEnv('VERCEL_ENV', 'production');
        const expectedOptions = {
            action: 'deleteMany',
            data: {
                database: 'refunds',
                collection: 'transactions',
                filter: { canDelete: { $eq: true } }
            }
        };
        const response = { response: 'response' };
        mongoApiRequestMock.mockImplementationOnce(() => Promise.resolve(response));

        // exercise
        const result = await deleteInvalidRefundTransactions();

        // verify
        expect(result).toEqual(response);
        expect(mongoApiRequestMock).toHaveBeenNthCalledWith(1, expectedOptions);

        // cleanup
        vi.unstubAllEnvs();
    });

    it('should bubble errors when deleting invalid refund transactions', async () => {
        // setup
        const message = 'message';
        const code = 401;
        mongoApiRequestMock.mockRejectedValueOnce(new MongoDataApiRequestError(message, code));

        // exercise && verify
        await expect(deleteInvalidRefundTransactions()).rejects.toThrowError(
            new MongoDataApiRequestError(message, code)
        );
    });
});
