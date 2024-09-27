// TODO: https://www.mongodb.com/pt-br/docs/atlas/app-services/data-api/data-api-deprecation/
import {
    ACTIONS,
    DATABASES,
    type MongoFilter,
    type MongoProjection,
    type MongoLimit,
    type CollectionConfiguration,
    type CollectionMetadata
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
 * @param options
 * @param [options.filter] - filters to apply to the query
 * @param [options.projection] - projection info to add/remove from request
 * @param [options.limit] - max number of entries to query
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

type MetadataProps = {
    collection: string;
    ids: number[];
};

/**
 * Performs a query to mongodb NFStudio database to fetch a set of nfts metadata from a specific collection.
 *
 * @param options
 * @param options.collection - name of the collection to query
 * @param options.ids - id(s) to fetch from `collection`
 *
 * @throws {Error | MongoDataApiRequestError} if request failed
 */
export const queryMetadata = async ({ collection, ids }: MetadataProps) => {
    const { documents: metadata } = await mongoApiRequest<CollectionMetadata>({
        action: ACTIONS.FIND,
        data: {
            database: DATABASES.METADATA,
            collection: collection.toLowerCase(),
            filter: {
                _id: {
                    $in: ids
                }
            }
        }
    });

    return metadata;
};
