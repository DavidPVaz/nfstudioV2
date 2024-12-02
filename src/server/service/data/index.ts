import { getDbConnection, toSelectQuery } from '@/server/service/data/core';
import type { Collection } from '@/server/service/data/types';
import type { Operators } from 'drizzle-orm';

export const queryCollectionsData = ({
    limit,
    orderBy = { operator: 'desc', column: 'createdAt' },
    select,
    filter
}: {
    limit?: number;
    orderBy?: { operator: 'asc' | 'desc'; column: keyof Collection };
    select?: keyof Collection | (keyof Collection)[];
    filter?: Partial<Record<keyof Operators, Partial<Collection>>>;
}) =>
    getDbConnection().query.collections.findMany({
        limit,
        orderBy: (collections, orderByOperators) => [
            orderByOperators[orderBy.operator](collections[orderBy.column])
        ],
        columns: toSelectQuery(select),
        where: (collections, operators) => {
            const { and, eq } = operators;

            if (!filter) {
                return eq(collections.active, true);
            }

            const clauses = Object.entries(filter).reduce((acc, [operator, kv]) => {
                const operation = operators[operator];
                const queries = Object.entries(kv).map(([column, value]) =>
                    operation(collections[column], value)
                );

                return [...acc, ...queries];
            }, []);

            return and(eq(collections.active, true), ...clauses);
        }
    });
