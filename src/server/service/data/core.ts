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
 * Build query data.
 *
 * @example
 * // returns { id: true, name: true };
 * buildQuery(['id', 'name']);
 *
 * @param args - arguments to build the query
 */
export const buildQuery = <T>(args?: keyof T | (keyof T)[]) =>
    !args
        ? undefined
        : (Array.isArray(args) ? args : [args]).reduce(
              (acc, arg) => ({ ...acc, [arg]: true }),
              {} as Partial<Record<keyof T, boolean>>
          );

/**
 * Generates select query data from entity T column(s) name.
 *
 * @param columns - entity properties to select
 */
export const toSelectQuery = <T>(columns?: keyof T | (keyof T)[]) => buildQuery<T>(columns);

/**
 * Generates relations query data from entity mapped relations.
 *
 * @param relations - relations table names to fetch
 */
export const toRelationQuery = <T>(relations?: keyof T | (keyof T)[]) => buildQuery<T>(relations);
