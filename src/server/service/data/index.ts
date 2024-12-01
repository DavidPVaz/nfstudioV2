import type { LibSQLDatabase } from 'drizzle-orm/libsql/driver-core';
import type { Client } from '@libsql/client/node';
import { drizzle } from 'drizzle-orm/libsql/node';
import { createClient } from '@libsql/client';
import * as schema from '../../../../db/schema';

type CollectionsSelectFields = keyof typeof schema.collections.$inferSelect;

/**
 * Pointer for a loaded database connection in memory.
 */
let db:
    | (LibSQLDatabase<typeof schema> & {
          $client: Client;
      })
    | null = null;

/**
 * Retrieves a database connection.
 */
const getDbConnection = () =>
    db ??
    (db = drizzle({
        schema,
        client: createClient({
            url: process.env.DATABASE_URL!,
            authToken: process.env.DATABASE_AUTH_TOKEN
        })
    }));

const mapToSelectQuery = <T extends string>(fields?: T | T[]) =>
    !fields
        ? undefined // if fields are not provided, select all fields
        : (Array.isArray(fields) ? fields : [fields]).reduce(
              (acc, field) => ({ ...acc, [field]: true }),
              {}
          );

export const queryCollectionsData2 = ({
    select,
    limit
}: {
    select?: CollectionsSelectFields | CollectionsSelectFields[];
    limit?: number;
}) =>
    getDbConnection().query.collections.findMany({
        limit,
        orderBy: (collections, { desc }) => [desc(collections.createdAt)],
        columns: mapToSelectQuery(select)
    });
