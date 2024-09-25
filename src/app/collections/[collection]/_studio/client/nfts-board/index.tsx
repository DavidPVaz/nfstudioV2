import React, { useEffect, useMemo } from 'react';
import {
    type SelectedNFTs,
    type NFT,
    useStudioSessionContext
} from '@/app/collections/[collection]/_studio/client';
import { NFTCard, NFTCardSkeleton } from '@/components/molecules/card/nft';
import {
    LoadNFTs,
    RefreshNFTs
} from '@/app/collections/[collection]/_studio/client/nfts-board/load-nfts';
import { Help } from '@/app/collections/[collection]/_studio/client/nfts-board/help';
import { Downloads } from '@/app/collections/[collection]/_studio/client/nfts-board/downloads';
import { Wizard } from '@/app/collections/[collection]/_studio/client/nfts-board/wizard';
import { loadMetadata, type LoadMetadataProps } from '@/app/_api';
import { useFallbackApiRead } from '@/hooks/use-api';
import { useNotification } from '@/hooks/use-notification';
import { useStudioContext } from '@/app/collections/[collection]/_studio/client/context';

const areCompleteNFTs = (nfts: SelectedNFTs): nfts is NFT[] =>
    nfts.every(
        nft =>
            typeof (nft as NFT).id === 'number' &&
            typeof (nft as NFT).selected === 'boolean' &&
            typeof (nft as NFT).src === 'string'
    );
const hasLoadedNFTs = (nfts: SelectedNFTs) => nfts.length > 0;

export const NftsBoard = () => {
    const { selectedCollection, unsupportedTraits, cacheStrategy } = useStudioContext();
    const { nfts, onCompleteNFTsLoad, onNFTSelect } = useStudioSessionContext();
    const { notify } = useNotification();

    const userHasLoadedNFTs = useMemo(() => hasLoadedNFTs(nfts), [nfts]);
    const nftsLoadIsComplete = useMemo(
        () => userHasLoadedNFTs && areCompleteNFTs(nfts),
        [nfts, userHasLoadedNFTs]
    );

    const { response, noNetwork } = useFallbackApiRead<LoadMetadataProps, NFT[]>({
        method: loadMetadata,
        args: { collection: selectedCollection, nfts, unsupportedTraits },
        enabled: userHasLoadedNFTs && !nftsLoadIsComplete,
        initialFallback: nftsLoadIsComplete ? (nfts as NFT[]) : [],
        onError: error =>
            notify({
                title: 'Whoops!',
                description: error.message,
                duration: 6000,
                variant: 'destructive'
            })
    });

    useEffect(() => {
        if (nftsLoadIsComplete) {
            return;
        }

        if (response) {
            onCompleteNFTsLoad(response);
        }
    }, [nftsLoadIsComplete, response, onCompleteNFTsLoad]);

    if (!userHasLoadedNFTs) {
        return <LoadNFTs />;
    }

    if (noNetwork) {
        return (
            <span className="p-8 text-lg">
                You are offline. Your request will resume as soon as you come back online.
            </span>
        );
    }

    return (
        <div className="relative flex w-full flex-col">
            <div className="container relative flex-1 overflow-y-auto overscroll-none">
                <div className="grid w-full grid-cols-1 gap-3 pb-8 pt-8 xs:grid-cols-2 2xs:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {!nftsLoadIsComplete
                        ? Array.from({ length: nfts.length }, (_, i) => <NFTCardSkeleton key={i} />)
                        : (nfts as NFT[]).map(({ id, src, selected }) => (
                              <NFTCard
                                  key={id}
                                  imgSrc={src}
                                  id={id}
                                  selected={selected}
                                  onClick={onNFTSelect}
                                  {...cacheStrategy}
                              />
                          ))}
                </div>
            </div>
            <div className="sticky bottom-0 flex h-16 w-full flex-row items-center justify-center gap-x-2 rounded-b-lg border-t xs:gap-x-4 sm:h-20 sm:gap-x-6">
                <div className="relative flex flex-row gap-x-1 sm:gap-x-2">
                    <Help />
                    <RefreshNFTs />
                    <Downloads />
                </div>

                <Wizard disabled={!nftsLoadIsComplete} />
            </div>
        </div>
    );
};
