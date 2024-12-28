import { getDbConnection, buildQuery } from '@/server/service/data/core';
import type {
    Collection,
    CollectionWithRelations,
    CollectionManyRelation,
    RefundInsert,
    RefundWithCurrency
} from '@/server/service/data/types';
import { inArray, type Operators, type SQL } from 'drizzle-orm';

/**
 * Performs a query to NFStudio database to fetch available collections data.
 *
 * @param options
 * @param options.limit - max number of entries to query
 * @param options.orderBy - order operator and table column to decide the order of the fetched entries
 * @param options.select - columns to select
 * @param options.filter - filters to conditionally fetch collection data
 * @param options.relation - relations to eagerly fetch
 *
 * @throws {Error} if request failed
 */
export const queryCollectionsData = ({
    limit,
    orderBy = { operator: 'desc', column: 'createdAt' },
    select,
    filter,
    relation
}: {
    limit?: number;
    orderBy?: { operator: 'asc' | 'desc'; column: keyof Collection };
    select?: keyof Collection | (keyof Collection)[];
    filter?: Partial<Record<keyof Operators, Partial<Collection>>>;
    relation?: keyof CollectionManyRelation | (keyof CollectionManyRelation)[];
}) =>
    getDbConnection().query.collections.findMany({
        limit,
        orderBy: (collections, orderByOperators) => [
            orderByOperators[orderBy.operator](collections[orderBy.column])
        ],
        columns: buildQuery<Collection>(select),
        where: (collections, operators) => {
            const { and, eq } = operators;

            if (!filter) {
                return eq(collections.active, true);
            }

            const filterQueries = Object.entries(filter).reduce(
                (acc, [operator, kv]) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    const operation = operators[operator];
                    const queries = Object.entries(kv).map(
                        ([column, value]) =>
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                            operation(collections[column], value) as SQL<typeof collections>
                    );

                    return [...acc, ...queries];
                },
                [] as SQL<typeof collections>[]
            );

            return and(eq(collections.active, true), ...filterQueries);
        },
        with: buildQuery<CollectionManyRelation>(relation)
    }) as Promise<CollectionWithRelations[]>;

/**
 * Performs a query to NFStudio database to fetch a set of nfts metadata from a specific collection.
 *
 * @param options
 * @param options.collection - name of the collection to query
 * @param options.ids - id(s) to fetch from `collection`
 *
 * @throws {Error} if request failed
 */
export const queryMetadata = ({ collection, ids }: { collection: string; ids: number[] }) =>
    getDbConnection().query.nft_metadata.findMany({
        where: (nftMetadata, { and, eq, inArray }) =>
            and(eq(nftMetadata.collection, collection), inArray(nftMetadata.nftId, ids))
    });

/**
 * Performs an insert query to NFStudio database to save a refund transaction.
 *
 * @param transaction - the NFStudio refund transaction to persist
 *
 * @throws {Error} if request failed
 */
export const insertRefundTransaction = (transaction: RefundInsert) =>
    getDbConnection().insert(getDbConnection()._.fullSchema.refunds).values(transaction);

/**
 * Performs a query to NFStudio database to fetch verified refund transactions to be processed.
 *
 * @throws {Error} if request failed
 */
export const queryVerifiedRefundTransactionsToProcess = () =>
    getDbConnection().query.refunds.findMany({
        with: {
            currency: true
        },
        where: (refunds, { and, eq, isNull }) =>
            and(
                eq(refunds.verified, true),
                eq(refunds.refunded, false),
                isNull(refunds.associatedRefundTransactionSignature)
            ),
        orderBy: (refunds, { asc }) => asc(refunds.createdAt)
    }) as Promise<RefundWithCurrency[]>;

/**
 * Performs an update query to NFStudio database to update the new refund transactions state.
 * Updates multiple refund transactions.
 *
 * @param options
 * @param options.ids - the transactions id to update
 * @param options.newState - the transactions new state
 *
 * @throws {Error} if request failed
 */
export const updateManyRefundTransactions = ({
    ids,
    newState
}: {
    ids: RefundWithCurrency['id'][];
    newState: Partial<RefundInsert>;
}) => {
    const refunds = getDbConnection()._.fullSchema.refunds;

    return getDbConnection().update(refunds).set(newState).where(inArray(refunds.id, ids));
};
