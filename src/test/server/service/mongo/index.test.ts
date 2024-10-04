import { describe, expect, vi, afterEach, it } from 'vitest';
import {
    queryCollectionsData,
    queryMetadata,
    insertRefundTransaction
} from '@/server/service/mongo';
import { MongoDataApiRequestError } from '@/server/service/mongo/core';
import type { NFStudioUnverifiedRefundTransaction } from '@/server/service/helio/types';

const { mongoApiRequestMock } = vi.hoisted(() => ({
    mongoApiRequestMock: vi.fn()
}));

vi.mock('server-only', () => ({}));

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

        // exercise
        await insertRefundTransaction(transaction);

        // verify
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

        // exercise
        await insertRefundTransaction(transaction);

        // verify
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
});
