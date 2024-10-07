// TODO: https://www.mongodb.com/pt-br/docs/atlas/app-services/data-api/data-api-deprecation/ -> https://docs.neurelo.com/guides/mongodb-atlas-migrate-rest-data-apis-to-neurelo
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
import type {
    NFStudioVerifiedRefundTransaction,
    NFStudioUnverifiedRefundTransaction
} from '@/server/service/helio/types';

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

/**
 * Performs an insert query to NFStudio database to save a refund transaction.
 *
 * @param transaction - the NFStudio refund transaction to persist
 *
 * @throws {Error | MongoDataApiRequestError} if request failed
 */
export const insertRefundTransaction = (
    transaction: NFStudioVerifiedRefundTransaction | NFStudioUnverifiedRefundTransaction
) =>
    mongoApiRequest({
        action: ACTIONS.INSERT_ONE,
        data: {
            database: DATABASES.REFUNDS,
            collection: `transactions${process.env.VERCEL_ENV === 'production' ? '' : '-staging'}`,
            document: transaction
        }
    });

/**
 * Performs a query to NFStudio database to fetch verified refund transactions to be processed.
 *
 * @throws {Error | MongoDataApiRequestError} if request failed
 */
export const queryVerifiedRefundTransactionsToProcess = async () => {
    const { documents: transactions } = await mongoApiRequest<NFStudioVerifiedRefundTransaction>({
        action: ACTIONS.FIND,
        data: {
            database: DATABASES.REFUNDS,
            collection: `transactions${process.env.VERCEL_ENV === 'production' ? '' : '-staging'}`,
            filter: {
                verified: { $eq: true },
                refunded: { $eq: false },
                associatedRefundTransactionSignature: { $ne: true }
            },
            sort: {
                createdAt: -1
            }
        }
    });

    return transactions;
};

/**
 * Performs a query to NFStudio database to fetch unverified refund transactions to be re-evaluated.
 * It ignores the ones flagged for deletion because that means they are already reevaluated.
 *
 * @throws {Error | MongoDataApiRequestError} if request failed
 */
export const queryUnverifiedRefundTransactionsToReevaluate = async () => {
    const { documents: transactions } = await mongoApiRequest<NFStudioUnverifiedRefundTransaction>({
        action: ACTIONS.FIND,
        data: {
            database: DATABASES.REFUNDS,
            collection: `transactions${process.env.VERCEL_ENV === 'production' ? '' : '-staging'}`,
            filter: { verified: { $eq: false }, canDelete: { $ne: true } },
            sort: {
                createdAt: -1
            }
        }
    });

    return transactions;
};
/**
 * Performs an updateMany query to NFStudio database to update the new refund transactions state.
 * Updates multiple refund transactions with the same state.
 *
 * @param options
 * @param options.ids - the transactions id to update
 * @param options.newState - the transactions new state
 *
 * @throws {Error | MongoDataApiRequestError} if request failed
 */
export const updateManyRefundTransactions = ({
    ids,
    newState
}: {
    ids: NFStudioVerifiedRefundTransaction['_id'][];
    newState: Partial<NFStudioVerifiedRefundTransaction>;
}) =>
    mongoApiRequest({
        action: ACTIONS.UPDATE_MANY,
        data: {
            database: DATABASES.REFUNDS,
            collection: `transactions${process.env.VERCEL_ENV === 'production' ? '' : '-staging'}`,
            filter: { _id: { $in: ids } },
            update: {
                $set: newState
            }
        }
    });

/**
 * Performs an updateOne query to NFStudio database to update the new refund transaction state.
 * Update one refund transactions with its own state.
 *
 * @param refundTransaction transaction to update
 *
 * @throws {Error | MongoDataApiRequestError} if request failed
 */
export const updateOneRefundTransaction = ({
    _id,
    ...newState
}: NFStudioVerifiedRefundTransaction | NFStudioUnverifiedRefundTransaction) =>
    mongoApiRequest({
        action: ACTIONS.UPDATE_ONE,
        data: {
            database: DATABASES.REFUNDS,
            collection: `transactions${process.env.VERCEL_ENV === 'production' ? '' : '-staging'}`,
            filter: { _id: { $eq: _id } },
            update: {
                $set: newState
            }
        }
    });

/**
 * Performs a deleteMany query to NFStudio database to delete any invalid refund transactions flagged for deletion.
 *
 * @throws {Error | MongoDataApiRequestError} if request failed
 */
export const deleteInvalidRefundTransactions = () =>
    mongoApiRequest({
        action: ACTIONS.DELETE_MANY,
        data: {
            database: DATABASES.REFUNDS,
            collection: `transactions${process.env.VERCEL_ENV === 'production' ? '' : '-staging'}`,
            filter: { canDelete: { $eq: true } }
        }
    });
