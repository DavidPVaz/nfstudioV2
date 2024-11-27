import { drizzle } from 'drizzle-orm/libsql/node';
import { createClient } from '@libsql/client';
import * as schema from '../../../../db/schema';

export const db = drizzle({
    schema,
    client: createClient({
        url: process.env.DATABASE_URL!,
        authToken: process.env.DATABASE_AUTH_TOKEN
    })
});
