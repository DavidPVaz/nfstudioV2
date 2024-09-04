import 'server-only';

import {
    ACTIONS,
    DATABASES,
    type MongoFilter,
    type MongoProjection,
    type MongoLimit,
    type CollectionConfiguration
} from '@/server/service/mongo/types';
import { mongoApiRequest } from '@/server/service/mongo/core';

type CollectionsDataProps = {
    filter?: MongoFilter;
    projection?: MongoProjection<CollectionConfiguration>;
    limit?: MongoLimit;
};

/**
 * Performs a query to mongodb NFStudio database to fetch available collections data.
 *
 * @param {CollectionsDataProps} options - options to query collection
 * @param {CollectionsDataProps['filter']} [options.filter] - filters to apply to the query
 * @param {CollectionsDataProps['projection']} [options.projection] - projection info to add/remove from request
 * @param {CollectionsDataProps['limit']} [options.limit] - max number of entries to query
 *
 * @throws {Error | MongoDataApiRequestError} if request failed
 */
export const queryCollectionsData = async ({
    filter = {},
    projection = {},
    limit = null
}: CollectionsDataProps = {}) => {
    const { documents: collections } = await mongoApiRequest<CollectionConfiguration>({
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
        }
    });

    return collections;
};
