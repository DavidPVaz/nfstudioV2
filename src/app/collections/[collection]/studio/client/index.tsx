'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Skeleton } from '@/components/atoms/skeleton';
import { useStudioContext } from '@/app/collections/[collection]/studio/client/context';
import { NftsBoard } from '@/app/collections/[collection]/studio/client/nfts-board';
import { useLocalStorage } from '@/hooks/use-local-storage';

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

export const StudioClientContent = () => {
    const { selectedCollection } = useStudioContext();
    const [nfts, setNfts] = useLocalStorage<SelectedNFTs>(selectedCollection, []);
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

    return !client ? (
        <Skeleton className="min-h-full w-full bg-muted" />
    ) : (
        <NftsBoard
            nfts={nfts}
            onCompleteLoad={onCompleteNFTsLoad}
            onIncompleteLoad={onIncompleteNFTsLoad}
            onNFTSelect={onNFTSelect}
        />
    );
};
