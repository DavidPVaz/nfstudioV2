'use client';

import React, { useMemo } from 'react';
import { useStudioContext } from '@/app/collections/[collection]/studio/client/context';
import { Skeleton } from '@/components/atoms/skeleton';
import { LoadNfts } from '@/app/collections/[collection]/studio/client/load-nfts';
import { NftsBoard } from '@/app/collections/[collection]/studio/client/nfts-board';

export const StudioClientContent = () => {
    const { nfts } = useStudioContext();

    const Component = useMemo(
        () => () =>
            nfts === undefined || nfts === null ? (
                <Skeleton className="min-h-full w-full" />
            ) : nfts.length === 0 ? (
                <LoadNfts />
            ) : (
                <NftsBoard />
            ),
        [nfts]
    );

    return <Component />;
};
