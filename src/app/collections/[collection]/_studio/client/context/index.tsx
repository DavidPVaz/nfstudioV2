'use client';

import React, { createContext, useContext } from 'react';
import type { CollectionConfiguration } from '@/server/service/mongo/types';

type StudioContext = {
    selectedCollection: CollectionConfiguration['_id'];
    cacheStrategy: CollectionConfiguration['config']['cacheStrategy'];
    logos: CollectionConfiguration['config']['logos'];
    unsupportedTraits: CollectionConfiguration['config']['unsupportedTraits'];
    paylinkId: CollectionConfiguration['config']['paylinkId'];
};

const Context = createContext({});

export const StudioContextProvider = ({
    collectionConfiguration,
    children
}: {
    collectionConfiguration: CollectionConfiguration;
    children: React.ReactNode;
}) => {
    const {
        _id: selectedCollection,
        config: { logos, unsupportedTraits, cacheStrategy, paylinkId }
    } = collectionConfiguration;

    const context = {
        selectedCollection,
        cacheStrategy,
        logos,
        unsupportedTraits,
        paylinkId:
            process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
                ? paylinkId
                : process.env.NEXT_PUBLIC_PAYLINK_ID
    };

    return <Context.Provider value={context}>{children}</Context.Provider>;
};

export const useStudioContext = () => useContext(Context) as StudioContext;
