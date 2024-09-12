import React, { useEffect } from 'react';
import { useStudioContext } from '@/app/collections/[collection]/studio/client/context';
import type {
    SelectedNFTs,
    NFT,
    IncompleteNFT
} from '@/app/collections/[collection]/studio/client';
import { loadMetadata, type LoadMetadataProps } from '@/app/api';
import { useApiRead } from '@/hooks/use-api';
import { NFTCard } from '@/components/molecules/card';
import { LoadNfts } from '../load-nfts';

const areCompleteNFTs = (nfts: SelectedNFTs): nfts is NFT[] =>
    Array.isArray(nfts) &&
    nfts.every(
        nft =>
            typeof (nft as NFT).id === 'number' &&
            typeof (nft as NFT).selected === 'boolean' &&
            typeof (nft as NFT).src === 'string'
    );

const itDidFetchCompleteNFTsInfo = (fetchedNFTsInfo: NFT[] | undefined) =>
    fetchedNFTsInfo && areCompleteNFTs(fetchedNFTsInfo);

export const NftsBoard = ({
    nfts,
    onCompleteLoad,
    onIncompleteLoad,
    onNFTSelect
}: {
    nfts: SelectedNFTs;
    onCompleteLoad: (nfts: NFT[]) => void;
    onIncompleteLoad: ({ ids }: { ids: IncompleteNFT[] }) => void;
    onNFTSelect: (selectedId: number) => void;
}) => {
    const { selectedCollection, unsupportedTraits, cacheStrategy } = useStudioContext();

    const { response, isLoading } = useApiRead<LoadMetadataProps, NFT[]>({
        method: loadMetadata,
        args: { collection: selectedCollection, nfts, unsupportedTraits },
        enabled: !areCompleteNFTs(nfts),
        onError: error => console.log(error)
    });

    // TODO: deal with error by notifying user - toast
    // TODO: in case of error, rollback to showing previous complete nft data if any

    useEffect(() => {
        if (areCompleteNFTs(nfts)) {
            return;
        }

        if (itDidFetchCompleteNFTsInfo(response)) {
            onCompleteLoad(response!);
        }
    }, [nfts, response, onCompleteLoad]);

    if (nfts.length === 0) {
        return <LoadNfts onIncompleteLoad={onIncompleteLoad} />;
    }

    return (
        <div className="relative flex w-full flex-col">
            <div className="container relative flex-1 overflow-y-auto">
                {isLoading || !areCompleteNFTs(nfts) ? (
                    'Loading... optimistically render skeleton with same number as user requested'
                ) : (
                    <div className="grid w-full grid-cols-1 gap-3 pb-8 pt-8 xs:grid-cols-2 2xs:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {nfts.map(({ id, src, selected }) => (
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
                )}
            </div>
            <div className="sticky bottom-0 h-20 w-full rounded-b-lg border-t">Toolbar</div>
        </div>
    );
};
