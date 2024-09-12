'use client';

import React, { useCallback } from 'react';
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
export type LoadIncompleteNFTs = ({ ids }: { ids: IncompleteNFT[] }) => void;
export type SelectedNFTs = NFT[] | IncompleteNFT[];

export const StudioClientContent = () => {
    const { selectedCollection } = useStudioContext();
    const [nfts, setNfts] = useLocalStorage<SelectedNFTs>(selectedCollection, []);

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

    return (
        <NftsBoard
            nfts={nfts}
            onCompleteLoad={onCompleteNFTsLoad}
            onIncompleteLoad={onIncompleteNFTsLoad}
            onNFTSelect={onNFTSelect}
        />
    );
};
