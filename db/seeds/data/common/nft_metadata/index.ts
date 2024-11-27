import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { promises, readFile, writeFile } from 'fs';
import path from 'path';

const NFT_METADATA_FOLDER = path.join(__dirname);

const prepareNftMetadata = async () => {
    const files = await promises.readdir(NFT_METADATA_FOLDER);

    if (files.find(file => path.parse(file).name === 'index')) {
        return Promise.resolve();
    }

    const collections = files
        .map(file => !path.parse(file).ext && path.parse(file).name)
        .filter(folderPath => folderPath);

    const metadata = await Promise.all(
        collections.map(collection => {
            const collectionMetadataFilePath = `${NFT_METADATA_FOLDER}/${collection}/index.json`;

            return new Promise((resolve, reject) =>
                readFile(collectionMetadataFilePath, 'utf8', (error, data) => {
                    if (error) {
                        reject(error);
                    }

                    resolve(
                        (JSON.parse(data) as object[]).map(data => ({
                            ...data,
                            collection
                        }))
                    );
                })
            );
        })
    );

    writeFile(`${NFT_METADATA_FOLDER}/index.json`, JSON.stringify(metadata.flat(1)), error => {
        if (error) {
            throw error;
        }
    });
};

await prepareNftMetadata();
