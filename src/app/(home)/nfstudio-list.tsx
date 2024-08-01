'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import { type CollectionConfiguration } from '@/server/service/mongo/types';
import { CollectionsList } from '@/components/organisms';
import { useWindowWidth } from '@/hooks';

const BREAKPOINTS = {
    XL: 1280,
    LG: 1024,
    MD: 768,
    XS: 290
};
const COLLECTIONS_PER_BREAKPOINT = {
    [BREAKPOINTS.XL]: 12,
    [BREAKPOINTS.LG]: 10,
    [BREAKPOINTS.MD]: 8,
    [BREAKPOINTS.XS]: 6
};

type BreakpointCalculation = { width: number; previous: number | null };

const isXLBreakpoint = ({ width, previous: previousBreakpoint }: BreakpointCalculation) =>
    previousBreakpoint !== BREAKPOINTS.XL && width >= BREAKPOINTS.XL;
const isLGBreakpoint = ({ width, previous: previousBreakpoint }: BreakpointCalculation) =>
    previousBreakpoint !== BREAKPOINTS.LG && width >= BREAKPOINTS.LG && width < BREAKPOINTS.XL;
const isMDBreakpoint = ({ width, previous: previousBreakpoint }: BreakpointCalculation) =>
    previousBreakpoint !== BREAKPOINTS.MD && width >= BREAKPOINTS.MD && width < BREAKPOINTS.LG;
const isXSBreakpoint = ({ width, previous: previousBreakpoint }: BreakpointCalculation) =>
    previousBreakpoint !== BREAKPOINTS.XS && width >= BREAKPOINTS.XS && width < BREAKPOINTS.MD;

export const NFStudioList = ({ collections }: { collections: CollectionConfiguration[] }) => {
    const { width } = useWindowWidth();
    const previous = useRef<number | null>(null);
    const [numberOfCollectionsToShow, setNumberOfCollectionsToShow] = useState<number | null>(null);

    useLayoutEffect(() => {
        if (isXLBreakpoint({ width: width ?? window.innerWidth, previous: previous.current })) {
            previous.current = BREAKPOINTS.XL;
            setNumberOfCollectionsToShow(COLLECTIONS_PER_BREAKPOINT[BREAKPOINTS.XL]);
        } else if (
            isLGBreakpoint({ width: width ?? window.innerWidth, previous: previous.current })
        ) {
            previous.current = BREAKPOINTS.LG;
            setNumberOfCollectionsToShow(COLLECTIONS_PER_BREAKPOINT[BREAKPOINTS.LG]);
        } else if (
            isMDBreakpoint({ width: width ?? window.innerWidth, previous: previous.current })
        ) {
            previous.current = BREAKPOINTS.MD;
            setNumberOfCollectionsToShow(COLLECTIONS_PER_BREAKPOINT[BREAKPOINTS.MD]);
        } else if (
            isXSBreakpoint({ width: width ?? window.innerWidth, previous: previous.current })
        ) {
            previous.current = BREAKPOINTS.XS;
            setNumberOfCollectionsToShow(COLLECTIONS_PER_BREAKPOINT[BREAKPOINTS.XS]);
        }
    }, [width]);

    return (
        numberOfCollectionsToShow && (
            <CollectionsList collections={collections.slice(0, numberOfCollectionsToShow)} />
        )
    );
};
