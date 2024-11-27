// TODO: seed script
import { drizzle } from 'drizzle-orm/libsql/node';
import { createClient } from '@libsql/client';
import * as schema from '../schema';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { promises, readFile } from 'fs';
import path from 'path';

/*
import * as dotenv from "dotenv";
dotenv.config({ path: "./.env.development" });
 */

const SEEDS_FOLDER = path.join(__dirname, './data');

// TODO: add filtering for environment. dev/preview/ + production
const getTablesPerEnvironment = async () => {
    const environments = (await promises.readdir(SEEDS_FOLDER)).map(file => path.parse(file).name);

    return (
        await Promise.all(
            environments.map(async env => {
                const tables = await promises
                    .readdir(`${SEEDS_FOLDER}/${env}`)
                    .then(files => files.map(file => path.parse(file).name));

                return { [env]: tables };
            })
        )
    ).reduce((acc, current) => ({ ...acc, ...current }), {});
};

const getSeedData = async () => {
    const tables = await getTablesPerEnvironment();

    const tablesDataFilePath = Object.entries(tables).reduce(
        (acc, [env, tables]) => {
            const data = tables.reduce(
                (acc, tableName) => ({
                    ...acc,
                    [tableName]: `${SEEDS_FOLDER}/${env}/${tableName}/index.json`
                }),
                {}
            );

            return {
                ...acc,
                ...data
            };
        },
        {} as Record<string, string>
    );

    return (
        await Promise.all(
            Object.entries(tablesDataFilePath).map(async ([table, tableDataFilePath]) => ({
                [table]: await new Promise((resolve, reject) =>
                    readFile(tableDataFilePath, 'utf8', (error, data) => {
                        if (error) {
                            reject(error);
                        }

                        resolve(JSON.parse(data));
                    })
                )
            }))
        )
    ).reduce((acc, current) => ({ ...acc, ...current }), {});
};

await getSeedData();

/*
await (async () => {
    const db = drizzle({
        schema,
        client: createClient({
            url: process.env.DATABASE_URL!,
            authToken: process.env.DATABASE_AUTH_TOKEN
        })
    });

    console.log('Seed start');
    await db.insert(users).values(data);
    console.log('Seed done');
})();
*/
