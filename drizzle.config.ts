import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: 'db/schema.ts',
    dialect: 'turso',
    casing: 'snake_case',
    verbose: true,
    strict: true,
    out: 'db/migrations',
    migrations: {
        prefix: 'timestamp'
    },
    dbCredentials: {
        url: process.env.DATABASE_URL!,
        authToken: process.env.DATABASE_AUTH_TOKEN
    }
});
