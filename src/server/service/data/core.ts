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
 * Generates select query data from entity T field(s) name.
 *
 * @param fields - entity properties to select
 */
export const toSelectQuery = <T>(fields?: keyof T | (keyof T)[]) =>
    !fields
        ? undefined // if fields are not provided, select all fields
        : (Array.isArray(fields) ? fields : [fields]).reduce(
              (acc, field) => ({ ...acc, [field]: true }),
              {} as Record<keyof T, boolean>
          );
