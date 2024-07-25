import 'server-only';

import {
    mongoApiRequest,
    ACCESS_TYPES,
    ACTIONS,
    DATABASES,
    type MongoFilter,
    type MongoProjection,
    type MongoLimit
} from '@/server/service/mongo/core';

/**
 * Performs a query to mongodb NFStudio database to fetch available collections data.
 */
export const queryCollectionsData = async ({
    filter = {},
    projection = {},
    limit = null
}: {
    filter?: MongoFilter;
    projection: MongoProjection;
    limit?: MongoLimit;
}) => {
    const { documents: collections } = await mongoApiRequest({
        access: ACCESS_TYPES.APP,
        action: ACTIONS.FIND,
        data: {
            database: DATABASES.COLLECTIONS,
            collection: 'configurations',
            filter:
                process.env.VERCEL_ENV === 'production'
                    ? { active: { $eq: true }, ...filter }
                    : filter,
            projection,
            sort: {
                createdAt: -1
            },
            limit
        },
        retries: 3
    });

    return collections;
};

// TODO: tests
