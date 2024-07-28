import { describe, expect, vi, afterEach, it, beforeEach } from 'vitest';
import { mongoApiRequest, MongoDataApiRequestError } from '@/server/service/mongo/core';

const { customFetchMock } = vi.hoisted(() => ({
    customFetchMock: vi.fn()
}));

vi.mock('@/server/service/shared/http', () => ({
    customFetch: customFetchMock
}));

describe('server/service/mongo/core', () => {
    beforeEach(() => {
        vi.stubEnv('MONGO_API', 'api-url');
        vi.stubEnv('MONGO_API_KEY_READ', 'app');
        vi.stubEnv('MONGO_API_KEY_WRITE', 'admin');
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.unstubAllEnvs();
    });

    it('should perform a Mongo Api Request and resolve APP key', async () => {
        // setup
        const expected = {
            retries: 1,
            options: {
                url: 'api-url/find',
                init: { method: 'POST', headers: { 'api-key': 'app' } },
                data: {
                    database: 'collections',
                    collection: 'some collection',
                    dataSource: 'nfstudio'
                }
            },
            onErrorThrow: (message: string, code: number) =>
                new MongoDataApiRequestError(message, code)
        };
        const responseData = { data: 'data' };
        customFetchMock.mockImplementationOnce(() => Promise.resolve(responseData));

        // exercise
        const result = await mongoApiRequest({
            action: 'find',
            data: { database: 'collections', collection: 'some collection' }
        });

        // verify
        expect(customFetchMock).toHaveBeenCalledWith(expected);
        expect(customFetchMock).toHaveBeenCalledOnce();
        expect(result).toEqual(responseData);
    });

    it('should perform a Mongo Api Request and resolve ADMIN key', async () => {
        // setup
        const expected = {
            retries: 2,
            options: {
                url: 'api-url/insertOne',
                init: { method: 'POST', headers: { 'api-key': 'admin' } },
                data: {
                    database: 'refunds',
                    collection: 'some collection',
                    dataSource: 'nfstudio'
                }
            },
            onErrorThrow: (message: string, code: number) =>
                new MongoDataApiRequestError(message, code)
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
        expect(customFetchMock).toHaveBeenCalledWith(expected);
        expect(customFetchMock).toHaveBeenCalledOnce();
        expect(result).toEqual(responseData);
    });
});
