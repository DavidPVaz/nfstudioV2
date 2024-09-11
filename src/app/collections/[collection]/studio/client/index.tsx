'use client';

import React, { useMemo, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useStudioContext } from '@/app/collections/[collection]/studio/client/context';
import { Skeleton } from '@/components/atoms/skeleton';
import { LoadNfts } from '@/app/collections/[collection]/studio/client/load-nfts';
import { NftsBoard } from '@/app/collections/[collection]/studio/client/nfts-board';

export type NFT = {
    id: number;
    src: string;
    selected: boolean;
};
export type IncompleteNFT = {
    id: number;
};
export type LoadIncompleteNFTs = ({ ids }: { ids: IncompleteNFT[] }) => void;
export type Collection = NFT[] | IncompleteNFT[];

export const isNFTCollection = (collection: Collection): collection is NFT[] =>
    Array.isArray(collection) &&
    collection.every(
        nft =>
            typeof (nft as NFT).id === 'number' &&
            typeof (nft as NFT).selected === 'boolean' &&
            typeof (nft as NFT).src === 'string'
    );

export const StudioClientContent = () => {
    const { id } = useStudioContext();
    const [collection, setCollection] = useLocalStorage<Collection>(id, []);

    const onLoadNfts = useCallback(
        ({ ids }: { ids: IncompleteNFT[] }) => {
            setCollection(ids);
        },
        [setCollection]
    );

    const Component = useMemo(
        () => () =>
            collection === undefined || collection === null ? (
                <Skeleton className="min-h-full w-full" />
            ) : collection?.length === 0 ? (
                <LoadNfts onSubmit={onLoadNfts} />
            ) : (
                <NftsBoard collection={collection} />
            ),
        [collection, onLoadNfts]
    );

    return <Component />;
};
