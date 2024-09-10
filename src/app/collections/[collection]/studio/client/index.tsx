'use client';

import React, { useMemo } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useStudioContext } from '@/app/collections/[collection]/studio/client/context';
import { Skeleton } from '@/components/atoms/skeleton';
import { LoadNfts } from '@/app/collections/[collection]/studio/client/load-nfts';
import { NftsBoard } from '@/app/collections/[collection]/studio/client/nfts-board';

type NFT = {
    id: number;
    src: string;
    selected: boolean;
};

export const StudioClientContent = () => {
    const { id } = useStudioContext();
    const [collection, setCollection] = useLocalStorage<NFT[]>(id, []);

    const Component = useMemo(
        () => () =>
            collection === undefined || collection === null ? (
                <Skeleton className="min-h-full w-full" />
            ) : collection?.length === 0 ? (
                <LoadNfts />
            ) : (
                <NftsBoard />
            ),
        [collection]
    );

    return <Component />;
};
