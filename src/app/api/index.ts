import { buildQueryString } from '@/lib/utils';
import type { CollectionMetadata, CollectionConfiguration } from '@/server/service/mongo/types';
import type { NFT, IncompleteNFT } from '@/app/collections/[collection]/studio/client/context';

type LoadMetadataProps = {
    collection: string;
    ids: IncompleteNFT[];
    unsupportedTraits: CollectionConfiguration['config']['unsupportedTraits'];
};

type TokenMetadata = {
    image: string;
    attributes: {
        trait_type: string;
        value: string;
    }[];
};
/**
 * Performs a http request to own API to query NFT metadata.
 *
 * @param {LoadMetadataProps} options
 * @param {LoadMetadataProps['collection']} options.collection - the collection to query for metadata
 * @param {LoadMetadataProps['ids']} options.ids - the ID(s) of NFT to query for metadata
 * @param {LoadMetadataProps['unsupportedTraits']} options.unsupportedTraits - unsupported traits for this collection
 *
 * @throws {Error} if request failed
 */
export const loadMetadata = async ({ collection, ids, unsupportedTraits }: LoadMetadataProps) => {
    const response =
        (await fetch(
            `api/metadata?${buildQueryString({ collection, ids: [...new Set(ids.map(({ id }) => id))] })}`
        )) ?? {};

    if (response.status !== 200) {
        throw Error('Fetch error.');
    }

    const metadata = (await response.json()) as CollectionMetadata[];

    if (!metadata || metadata.length === 0) {
        throw Error('No Collection.');
    }

    return Promise.all(
        metadata.map(async ({ _id: id, uri }) => {
            const { image: src, attributes } = await fetch(uri).then(
                response => response.json() as Promise<TokenMetadata>
            );

            const traits: Record<string, string> = attributes.reduce(
                (acc, { trait_type, value }) => ({ ...acc, [trait_type]: value }),
                {}
            );

            return { id, src, traits };
        })
    ).then(collection =>
        // this collection has no unsupported traits, get all loaded nfts
        Object.keys(unsupportedTraits).length === 0
            ? collection.map(({ id, src }) => ({ id, src, selected: false }))
            : // get only the loaded nfts without unsupported traits
              collection
                  .filter(
                      ({ traits }) =>
                          !Object.entries(traits).find(([trait, value]) =>
                              (unsupportedTraits as Record<string, string[]>)[trait]?.includes(
                                  value
                              )
                          )
                  )
                  .map(({ id, src }) => ({ id, src, selected: false }))
    ) as Promise<NFT[]>;
};
