import { describe, expect, vi, afterEach, it } from 'vitest';
import { getDbConnection, buildQuery } from '@/server/service/data/core';
import * as schema from '../../../../../db/schema';

const { createClientMock, drizzleMock } = vi.hoisted(() => ({
    createClientMock: vi.fn(),
    drizzleMock: vi.fn()
}));

vi.mock('@libsql/client/node', async importOriginal => {
    const actual: object = await importOriginal();
    return {
        ...actual,
        createClient: createClientMock
    };
});

vi.mock('drizzle-orm/libsql/node', () => ({
    drizzle: drizzleMock
}));

describe('server/service/data/core', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should correctly instantiate a database connection', () => {
        // setup
        vi.stubEnv('DATABASE_URL', 'url');
        vi.stubEnv('DATABASE_AUTH_TOKEN', 'auth');
        const client = { client: 'client' };
        createClientMock.mockImplementationOnce(() => client);
        const db = { connection: 'connection' };
        drizzleMock.mockImplementationOnce(() => db);

        // exercise
        const connection = getDbConnection();

        // verify
        expect(connection).toEqual(db);
        expect(getDbConnection()).toBe(connection);
        expect(createClientMock).toHaveBeenNthCalledWith(1, { url: 'url', authToken: 'auth' });
        expect(drizzleMock).toHaveBeenNthCalledWith(1, { schema, client });

        // cleanup
        vi.unstubAllEnvs();
    });

    it('should correctly prepare a query', () => {
        // exercise && verify
        expect(buildQuery()).toEqual(undefined);
        expect(buildQuery('someField')).toEqual({ someField: true });
        expect(buildQuery(['fieldOne', 'fieldTwo', 'fieldThree'])).toEqual({
            fieldOne: true,
            fieldTwo: true,
            fieldThree: true
        });
    });
});
