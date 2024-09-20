import React, { useEffect, useMemo } from 'react';
import type {
    SelectedNFTs,
    NFT,
    LoadCompleteNFTs,
    LoadIncompleteNFTs
} from '@/app/collections/[collection]/_studio/client';
import { NFTCard, NFTCardSkeleton } from '@/components/molecules/card';
import { LoadNFTs } from '@/app/collections/[collection]/_studio/client/nfts-board/load-nfts';
import { Toolbar } from '@/app/collections/[collection]/_studio/client/nfts-board/toolbar';
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

export const NftsBoard = ({
    nfts,
    onCompleteLoad,
    onIncompleteLoad,
    onNFTSelect
}: {
    nfts: SelectedNFTs;
    onCompleteLoad: LoadCompleteNFTs;
    onIncompleteLoad: LoadIncompleteNFTs;
    onNFTSelect: (selectedId: number) => void;
}) => {
    const { selectedCollection, unsupportedTraits, cacheStrategy } = useStudioContext();
    const { notify } = useNotification();

    const userHasLoadedNFTs = useMemo(() => hasLoadedNFTs(nfts), [nfts]);
    const nftsLoadIsComplete = useMemo(
        () => userHasLoadedNFTs && areCompleteNFTs(nfts),
        [nfts, userHasLoadedNFTs]
    );
    const selectedId = useMemo(() => (nfts as NFT[]).find(({ selected }) => selected)?.id, [nfts]);

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
            onCompleteLoad(response);
        }
    }, [nftsLoadIsComplete, response, onCompleteLoad]);

    if (!userHasLoadedNFTs) {
        return <LoadNFTs onIncompleteLoad={onIncompleteLoad} />;
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
            <div className="container relative flex-1 overflow-y-auto">
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
            <Toolbar
                onRefresh={onIncompleteLoad}
                canCreate={nftsLoadIsComplete}
                selectedId={selectedId}
            />
        </div>
    );
};
