'use client';

import React, { createContext, useContext } from 'react';
import type { CollectionConfiguration } from '@/server/service/mongo/types';
import { useLocalStorage, type SetStateArgs } from '@/hooks/use-local-storage';

export type NFT = {
    id: number;
    src: string;
    selected: boolean;
};
export type IncompleteNFT = {
    id: number;
};
export type LoadIncompleteNFTs = ({ ids }: { ids: IncompleteNFT[] }) => void;
export type SelectedNFTs = NFT[] | IncompleteNFT[];

type StudioContext = {
    selectedCollection: CollectionConfiguration['_id'];
    cacheStrategy: CollectionConfiguration['config']['cacheStrategy'];
    logos: CollectionConfiguration['config']['logos'];
    unsupportedTraits: CollectionConfiguration['config']['unsupportedTraits'];
    paylinkId: CollectionConfiguration['config']['paylinkId'];
    nfts: SelectedNFTs;
    setNfts: (value: SetStateArgs<SelectedNFTs>) => void;
};

const Context = createContext({});

export const StudioContextProvider = ({
    collectionConfiguration,
    children
}: {
    collectionConfiguration: CollectionConfiguration;
    children: React.ReactNode;
}) => {
    const {
        _id: selectedCollection,
        config: { logos, unsupportedTraits, cacheStrategy, paylinkId }
    } = collectionConfiguration;

    const [nfts, setNfts] = useLocalStorage<SelectedNFTs>(selectedCollection, []);

    const context = {
        selectedCollection,
        cacheStrategy,
        logos,
        unsupportedTraits,
        paylinkId:
            process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
                ? paylinkId
                : process.env.NEXT_PUBLIC_PAYLINK_ID,
        nfts,
        setNfts
    };

    return <Context.Provider value={context}>{children}</Context.Provider>;
};

export const useStudioContext = () => useContext(Context) as StudioContext;
