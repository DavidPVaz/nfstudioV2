import { getDbConnection, buildQuery } from '@/server/service/data/core';
import type {
    Collection,
    CollectionWithRelations,
    CollectionManyRelation
} from '@/server/service/data/types';
import type { Operators, SQL } from 'drizzle-orm';

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
export const queryMetadata = async ({ collection, ids }: { collection: string; ids: number[] }) =>
    getDbConnection().query.nft_metadata.findMany({
        where: (nftMetadata, { and, eq, inArray }) =>
            and(eq(nftMetadata.collection, collection), inArray(nftMetadata.nftId, ids))
    });
