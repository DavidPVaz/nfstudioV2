import { buildQueryString } from '@/lib/utils';
import type { NftMetadata, UnsupportedTraits } from '@/server/service/data/types';
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
    unsupportedTraits: UnsupportedTraits[];
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

    const metadata = (await response.json()) as NftMetadata[];

    if (metadata.length === 0) {
        throw new EmptyMetadataError();
    }

    const withoutUnsupportedTraits = await Promise.all(
        metadata.map(async ({ nftId: id, uri }) => {
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
                unsupportedTraits.length === 0 ||
                !unsupportedTraits.find(unsupported =>
                    Object.entries(traits).find(
                        ([trait, value]) =>
                            unsupported.traitType === trait && unsupported.value === value
                    )
                )
            ) {
                return { id, src, selected: false } as NFT;
            }

            return null;
        })
    ).then(collection =>
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
    transactionSignature: string;
};

const STATUS_MESSAGE = {
    500: 'An unexpected error occurred while creating the image. You will be automatically refunded.'
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
        throw new OrderError(
            (STATUS_MESSAGE[response.status] as string) ??
                'An unexpected error occurred while creating the image.'
        );
    }

    return response.arrayBuffer();
};
