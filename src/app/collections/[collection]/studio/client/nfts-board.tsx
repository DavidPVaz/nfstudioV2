import React from 'react';
import {
    useStudioContext,
    type Collection,
    type NFT
} from '@/app/collections/[collection]/studio/client/context';

export const NftsBoard = () => {
    const { collection } = useStudioContext();

    return (
        <div className="relative flex">
            <div className="container relative overflow-y-auto">{JSON.stringify(collection)}</div>
            <div className="absolute bottom-0">Toolbar</div>
        </div>
    );
};

export const isNFTCollection = (collection: Collection): collection is NFT[] =>
    Array.isArray(collection) &&
    collection.every(
        nft =>
            typeof (nft as NFT).id === 'number' &&
            typeof (nft as NFT).selected === 'boolean' &&
            typeof (nft as NFT).src === 'string'
    );
