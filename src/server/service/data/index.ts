import { getDbConnection, buildQuery } from '@/server/service/data/core';
import type {
    Collection,
    CollectionWithRelations,
    CollectionManyRelation
} from '@/server/service/data/types';
import type { Operators, SQL } from 'drizzle-orm';

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
