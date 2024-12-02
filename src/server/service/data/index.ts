import { getDbConnection, toSelectQuery } from '@/server/service/data/core';
import type { CollectionSelectFields } from '@/server/service/data/types';

export const queryCollectionsData = ({
    select,
    limit
}: {
    select?: CollectionSelectFields | CollectionSelectFields[];
    limit?: number;
}) =>
    getDbConnection().query.collections.findMany({
        limit,
        orderBy: (collections, { desc }) => [desc(collections.createdAt)],
        columns: toSelectQuery(select)
    });
