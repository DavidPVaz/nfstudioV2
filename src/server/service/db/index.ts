import { drizzle } from 'drizzle-orm/libsql/node';
import { createClient } from '@libsql/client';

export const db = drizzle(
    createClient({
        url: process.env.DATABASE_URL!,
        authToken: process.env.DATABASE_AUTH_TOKEN
    })
);
