'use client';

import React, { useMemo } from 'react';
import { type CollectionConfiguration } from '@/server/service/mongo/types';
import { CollectionsList } from '@/components/organisms';
import { useMediaQuery } from '@/hooks';

export const NFStudioList = ({ collections }: { collections: CollectionConfiguration[] }) => {
    const isXSBreakpoint = useMediaQuery(
        'only screen and (min-width : 290px) and (max-width : 767px)'
    );
    const isMDBreakpoint = useMediaQuery(
        'only screen and (min-width : 768px) and (max-width : 1023px)'
    );
    const isLGBreakpoint = useMediaQuery(
        'only screen and (min-width : 1024px) and (max-width : 1279px)'
    );
    const isXLBreakpoint = useMediaQuery('only screen and (min-width : 1280px)');

    const numberOfCollectionsToShow = useMemo(
        () =>
            isXLBreakpoint ? 12 : isLGBreakpoint ? 10 : isMDBreakpoint ? 8 : isXSBreakpoint ? 6 : 3,
        [isXSBreakpoint, isMDBreakpoint, isLGBreakpoint, isXLBreakpoint]
    );

    return <CollectionsList collections={collections.slice(0, numberOfCollectionsToShow)} />;
};
