import { describe, expect, vi, afterEach, it, beforeEach } from 'vitest';
import { queryCollectionsData } from '@/server/service/mongo';

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

describe('server/service/mongo/index', () => {
    const documents = [
        { _id: '1', presentation: 'src1' },
        { _id: '2', presentation: 'src2' }
    ];

    afterEach(() => {
        vi.clearAllMocks();
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
});
