import { describe, expect, vi, afterEach, it } from 'vitest';
import { mongoApiRequest, MongoDataApiRequestError } from '@/server/service/mongo/core';
import { NFStudioRequestError } from '@/server/service/shared/http';

const { customFetchMock } = vi.hoisted(() => ({
    customFetchMock: vi.fn()
}));

vi.mock('server-only', () => ({}));

vi.mock('@/server/service/shared/http', async importOriginal => {
    const actual: object = await importOriginal();
    return {
        ...actual,
        customFetch: customFetchMock
    };
});

describe('server/service/mongo/core', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should perform a Mongo Api Request and resolve APP key', async () => {
        // setup
        const expected = {
            retries: 1,
            options: {
                url: `${process.env.MONGO_API}/find`,
                init: { method: 'POST', headers: { 'api-key': process.env.MONGO_API_KEY_READ } },
                data: {
                    database: 'collections',
                    collection: 'some collection',
                    dataSource: 'nfstudio'
                }
            }
        };
        const responseData = { data: 'data' };
        customFetchMock.mockImplementationOnce(() => Promise.resolve(responseData));

        // exercise
        const result = await mongoApiRequest({
            action: 'find',
            data: { database: 'collections', collection: 'some collection' }
        });

        // verify
        expect(result).toEqual(responseData);
        expect(customFetchMock).toHaveBeenNthCalledWith(1, expected);
    });

    it('should perform a Mongo Api Request and resolve ADMIN key', async () => {
        // setup
        const expected = {
            retries: 2,
            options: {
                url: `${process.env.MONGO_API}/insertOne`,
                init: { method: 'POST', headers: { 'api-key': process.env.MONGO_API_KEY_WRITE } },
                data: {
                    database: 'refunds',
                    collection: 'some collection',
                    dataSource: 'nfstudio'
                }
            }
        };
        const responseData = { data: 'data' };
        customFetchMock.mockImplementationOnce(() => Promise.resolve(responseData));

        // exercise
        const result = await mongoApiRequest({
            action: 'insertOne',
            data: { database: 'refunds', collection: 'some collection' },
            retries: 2
        });

        // verify
        expect(result).toEqual(responseData);
        expect(customFetchMock).toHaveBeenNthCalledWith(1, expected);
    });

    it('should throw MongoDataApiRequestError', async () => {
        // setup
        const statusText = 'message';
        const status = 500;
        const expected = {
            retries: 1,
            options: {
                url: `${process.env.MONGO_API}/insertOne`,
                init: { method: 'POST', headers: { 'api-key': process.env.MONGO_API_KEY_WRITE } },
                data: {
                    database: 'refunds',
                    collection: 'some collection',
                    dataSource: 'nfstudio'
                }
            }
        };
        customFetchMock.mockRejectedValueOnce(new NFStudioRequestError(statusText, status));

        // exercise && verify
        await expect(
            mongoApiRequest({
                action: 'insertOne',
                data: { database: 'refunds', collection: 'some collection' }
            })
        ).rejects.toThrowError(new MongoDataApiRequestError(statusText, status));
        expect(customFetchMock).toHaveBeenNthCalledWith(1, expected);
    });

    it('should throw received error if not NFStudio Error', async () => {
        // setup
        const statusText = 'message';
        const expected = {
            retries: 1,
            options: {
                url: `${process.env.MONGO_API}/insertOne`,
                init: { method: 'POST', headers: { 'api-key': process.env.MONGO_API_KEY_WRITE } },
                data: {
                    database: 'refunds',
                    collection: 'some collection',
                    dataSource: 'nfstudio'
                }
            }
        };
        customFetchMock.mockRejectedValueOnce(new Error(statusText));

        // exercise && verify
        await expect(
            mongoApiRequest({
                action: 'insertOne',
                data: { database: 'refunds', collection: 'some collection' }
            })
        ).rejects.toThrowError(new Error(statusText));
        expect(customFetchMock).toHaveBeenNthCalledWith(1, expected);
    });
});
