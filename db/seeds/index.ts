import { promises, readFile } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { drizzle } from 'drizzle-orm/libsql/node';
import { createClient } from '@libsql/client';
import * as schema from '../schema';
import 'dotenv/config';
import { SQLiteTable } from 'drizzle-orm/sqlite-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SEEDS_FOLDER = path.join(__dirname, 'data');
const MAX_LENGTH = 500;

const getTablesPerEnvironment = async () => {
    const environments = (await promises.readdir(SEEDS_FOLDER)).map(file => path.parse(file).name);

    return (
        await Promise.all(
            environments
                .filter(env => env === 'common' || env === process.env.VERCEL_ENV)
                .map(async env => {
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
                (acc, tableFolderName) => ({
                    ...acc,
                    [tableFolderName]: `${SEEDS_FOLDER}/${env}/${tableFolderName}/index.json`
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
            Object.entries(tablesDataFilePath)
                .sort(([a], [b]) => (a > b ? 1 : -1))
                .map(async ([tableFolderName, tableDataFilePath]) => {
                    const tableName = tableFolderName.slice(tableFolderName.indexOf('_') + 1);

                    return {
                        [tableName]: await new Promise((resolve, reject) =>
                            readFile(tableDataFilePath, 'utf8', (error, data) => {
                                if (error) {
                                    reject(error);
                                }

                                resolve(JSON.parse(data));
                            })
                        )
                    };
                })
        )
    ).reduce((acc, current) => ({ ...acc, ...current }), {});
};

await (async () => {
    const seeds = (await getSeedData()) as Record<string, object[]>;

    const db = drizzle({
        schema,
        client: createClient({
            url: process.env.DATABASE_URL!,
            authToken: process.env.DATABASE_AUTH_TOKEN
        })
    });

    const tableNameTablesMap = Object.keys(seeds).reduce(
        (acc, tableName) => ({
            ...acc,
            [tableName]: schema[tableName] as SQLiteTable
        }),
        {}
    );

    for (const [tableName, data] of Object.entries(seeds)) {
        if (data.length <= MAX_LENGTH) {
            await db.insert(tableNameTablesMap[tableName]).values(data);
            continue;
        }

        for (let index = 0; index < data.length; index += MAX_LENGTH) {
            const slice = index + MAX_LENGTH > data.length ? [index] : [index, index + MAX_LENGTH];

            await db.insert(tableNameTablesMap[tableName]).values(data.slice(...slice));
        }
    }
})();
