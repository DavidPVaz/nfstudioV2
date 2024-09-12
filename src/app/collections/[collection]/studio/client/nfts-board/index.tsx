import React, { useEffect } from 'react';
import {
    useStudioContext,
    type SelectedNFTs,
    type NFT
} from '@/app/collections/[collection]/studio/client/context';
import { loadMetadata, type LoadMetadataProps } from '@/app/api';
import { useApiRead } from '@/hooks/use-api';

const areCompleteNFTs = (nfts: SelectedNFTs): nfts is NFT[] =>
    Array.isArray(nfts) &&
    nfts.every(
        nft =>
            typeof (nft as NFT).id === 'number' &&
            typeof (nft as NFT).selected === 'boolean' &&
            typeof (nft as NFT).src === 'string'
    );

const itDidFetchCompleteNFTsInfo = ({
    currentNFTsInfo,
    fetchedNFTsInfo
}: {
    currentNFTsInfo: SelectedNFTs;
    fetchedNFTsInfo: NFT[] | undefined;
}) => !areCompleteNFTs(currentNFTsInfo) && fetchedNFTsInfo && areCompleteNFTs(fetchedNFTsInfo);

export const NftsBoard = () => {
    const { selectedCollection, nfts, unsupportedTraits, setNfts } = useStudioContext();

    const { response, isLoading } = useApiRead<LoadMetadataProps, NFT[]>({
        resources: [`${selectedCollection}-board`],
        method: loadMetadata,
        args: { collection: selectedCollection, nfts, unsupportedTraits },
        enabled: !areCompleteNFTs(nfts),
        onError: error => console.log(error)
    });

    useEffect(() => {
        if (itDidFetchCompleteNFTsInfo({ currentNFTsInfo: nfts, fetchedNFTsInfo: response })) {
            setNfts(response);
        }
    }, [nfts, response, setNfts]);

    return (
        <div className="relative flex w-full">
            <div className="container relative overflow-y-auto">
                {isLoading ? 'Loading...' : JSON.stringify(nfts)}
            </div>
            <div className="absolute bottom-0 w-full">Toolbar</div>
        </div>
    );
};
