import type { LibSQLDatabase } from 'drizzle-orm/libsql/driver-core';
import { type Client, createClient } from '@libsql/client/node';
import { drizzle } from 'drizzle-orm/libsql/node';
import * as schema from '../../../../db/schema';

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
export const getDbConnection = () =>
    db ??
    (db = drizzle({
        schema,
        client: createClient({
            url: process.env.DATABASE_URL!,
            authToken: process.env.DATABASE_AUTH_TOKEN
        })
    }));

/**
 * Generates select query data from entity T column(s) name.
 *
 * @param columns - entity properties to select
 */
export const toSelectQuery = <T>(columns?: keyof T | (keyof T)[]) =>
    !columns
        ? undefined // if columns are not specified, select all
        : (Array.isArray(columns) ? columns : [columns]).reduce(
              (acc, column) => ({ ...acc, [column]: true }),
              {} as Record<keyof T, boolean>
          );
