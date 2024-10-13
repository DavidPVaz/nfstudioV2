import { buildQueryString } from '@/lib/utils';
import type { CollectionMetadata, CollectionConfiguration } from '@/server/service/mongo/types';
import type { NFT, IncompleteNFT } from '@/app/collections/[collection]/_studio/client';
import {
    FetchMetadataError,
    EmptyMetadataError,
    UnsupportedTraitsError,
    OrderError
} from '@/app/_errors';

export type LoadMetadataProps = {
    collection: string;
    nfts: IncompleteNFT[];
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
 * Performs a http request to query NFT metadata.
 *
 * @param options
 * @param options.collection - the collection to query for metadata
 * @param options.nfts - the ID(s) of NFT to query for metadata
 * @param options.unsupportedTraits - unsupported traits for this collection
 *
 * @throws {Error} if request failed
 */
export const loadMetadata = async ({ collection, nfts, unsupportedTraits }: LoadMetadataProps) => {
    const response =
        (await fetch(
            `/api/metadata?${buildQueryString({ collection, ids: [...new Set(nfts.map(({ id }) => id))] })}`
        )) ?? {};

    if (response.status !== 200) {
        throw new FetchMetadataError();
    }

    const metadata = (await response.json()) as CollectionMetadata[];

    if (metadata.length === 0) {
        throw new EmptyMetadataError();
    }

    const withoutUnsupportedTraits = await Promise.all(
        metadata.map(async ({ _id: id, uri }) => {
            const { image: src, attributes } = await fetch(uri).then(
                response => response.json() as Promise<TokenMetadata>
            );

            const traits: Record<string, string> = attributes.reduce(
                (acc, { trait_type, value }) => ({ ...acc, [trait_type]: value }),
                {}
            );

            // this collection does not have any unsupported traits or
            // it did not find any unsupported trait in this nft
            if (
                Object.keys(unsupportedTraits).length === 0 ||
                !Object.entries(traits).find(([trait, value]) =>
                    unsupportedTraits[trait]?.includes(value)
                )
            ) {
                return { id, src, selected: false };
            }

            return null;
        })
    ).then(collection =>
        // ts is not smart enough to recognize a filter has taken place and gives an error on type check, hence cast
        (collection.filter(nft => nft !== null) as NFT[]).sort((a, b) => a.id - b.id)
    );

    if (withoutUnsupportedTraits.length === 0) {
        throw new UnsupportedTraitsError();
    }

    return withoutUnsupportedTraits;
};

export type OrderProps = {
    src: string;
    atRight: boolean;
    coverStyle: boolean;
    logoSrc: string | undefined;
    mobile: boolean;
    collection: string;
    width: number;
    height: number;
    dpi: number;
    statusToken: string;
    transactionSignature: string;
};

/**
 * Performs a http request to order the client's nft banner/wallpaper.
 *
 * @param data - the configuration data to apply when creating the banner/wallpaper
 *
 * @throws {Error} if request failed
 */
export const order = async (data: OrderProps) => {
    const response =
        (await fetch('/api/order', {
            method: 'POST',
            headers: {
                Accept: 'application/octet-stream',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })) ?? {};

    if (response.status !== 201) {
        throw new OrderError(response.statusText, response.status);
    }

    return response.arrayBuffer();
};
