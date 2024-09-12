import React, { useEffect, useCallback } from 'react';
import {
    useStudioContext,
    type SelectedNFTs,
    type NFT
} from '@/app/collections/[collection]/studio/client/context';
import { loadMetadata, type LoadMetadataProps } from '@/app/api';
import { useApiRead } from '@/hooks/use-api';
import { NFTCard } from '@/components/molecules/card';

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

export const NftsBoard = () => {
    const { selectedCollection, nfts, unsupportedTraits, setNfts, cacheStrategy } =
        useStudioContext();

    const { response, isLoading } = useApiRead<LoadMetadataProps, NFT[]>({
        resources: [`${selectedCollection}-board`],
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
            setNfts(response);
        }
    }, [nfts, response, setNfts]);

    const onNFTCardClick = useCallback(
        (selectedId: number) => {
            const updatedNfts = (nfts as NFT[]).map(nft => {
                const { id, selected, ...rest } = nft;

                if (id === selectedId || (id !== selectedId && selected)) {
                    return {
                        id,
                        selected: !selected,
                        ...rest
                    };
                }

                return nft;
            });

            setNfts(updatedNfts);
        },
        [nfts, setNfts]
    );

    return (
        <div className="relative flex w-full">
            <div className="container relative overflow-y-auto">
                {isLoading ? (
                    'Loading...'
                ) : (
                    <div className="grid w-full grid-cols-1 gap-3 pt-8 xs:grid-cols-2 2xs:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {(nfts as NFT[]).map(({ id, src, selected }) => (
                            <NFTCard
                                key={`${selectedCollection}-${id}`}
                                imgSrc={src}
                                id={id}
                                selected={selected}
                                onClick={onNFTCardClick}
                                {...cacheStrategy}
                            />
                        ))}
                    </div>
                )}
            </div>
            <div className="absolute bottom-0 w-full">Toolbar</div>
        </div>
    );
};
