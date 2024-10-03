'use client';

import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { NFStudioSkeleton } from '@/components/molecules/nfstudio-skeleton';
import { useCollectionContext } from '@/app/collections/[collection]/context';
import { NftsBoard } from '@/app/collections/[collection]/_studio/client/nfts-board';
import { useLocalStorage } from '@/hooks/use-local-storage';

const MAX_DOWNLOADS_IN_STORE = 2;
const Context = createContext({});

export type Download = {
    name: string;
    data: number[];
    createdAt: number;
};

export type NFT = {
    id: number;
    src: string;
    selected: boolean;
};
export type IncompleteNFT = {
    id: number;
};
export type LoadIncompleteNFTs = (incompleteNFTs: { ids: IncompleteNFT[] }) => void;
export type LoadCompleteNFTs = (nfts: NFT[]) => void;
export type SelectedNFTs = NFT[] | IncompleteNFT[];

type StudioContext = {
    nfts: SelectedNFTs;
    onCompleteNFTsLoad: LoadCompleteNFTs;
    onIncompleteNFTsLoad: LoadIncompleteNFTs;
    onNFTSelect: (selectedId: number) => void;
    downloads: Download[];
    onDownloadData: (data: Download) => void;
};

export const StudioContent = () => {
    const { selectedCollection } = useCollectionContext();
    const [nfts, setNfts] = useLocalStorage<SelectedNFTs>(selectedCollection, []);
    const [downloads, setDownloads] = useLocalStorage<Download[]>(
        `${selectedCollection}-downloads`,
        []
    );
    const [client, setClient] = useState<boolean>(false);

    useEffect(() => {
        if (!client) {
            setClient(true);
        }
    }, [client, setClient]);

    const onCompleteNFTsLoad = useCallback((nfts: NFT[]) => setNfts(nfts), [setNfts]);
    const onIncompleteNFTsLoad = useCallback(
        ({ ids }: { ids: IncompleteNFT[] }) => setNfts(ids),
        [setNfts]
    );
    const onNFTSelect = useCallback(
        (selectedId: number) => {
            setNfts(nfts =>
                (nfts as NFT[]).map(nft => {
                    const { id, selected, ...rest } = nft;

                    if (id === selectedId || (id !== selectedId && selected)) {
                        return {
                            id,
                            selected: !selected,
                            ...rest
                        };
                    }

                    return nft;
                })
            );
        },
        [setNfts]
    );

    const onDownloadData = useCallback(
        (newDownload: Download) => {
            setDownloads(currentDownloads => {
                const newDownloadsData = [...currentDownloads, newDownload].sort(
                    (a, b) => b.createdAt - a.createdAt
                );

                if (newDownloadsData.length <= MAX_DOWNLOADS_IN_STORE) {
                    return newDownloadsData;
                }

                return newDownloadsData.slice(0, MAX_DOWNLOADS_IN_STORE);
            });
        },
        [setDownloads]
    );

    const context = {
        nfts,
        onCompleteNFTsLoad,
        onIncompleteNFTsLoad,
        onNFTSelect,
        downloads,
        onDownloadData
    };

    return !client ? (
        <NFStudioSkeleton />
    ) : (
        <Context.Provider value={context}>
            <NftsBoard />
        </Context.Provider>
    );
};

export const useStudioContext = () => useContext(Context) as StudioContext;
