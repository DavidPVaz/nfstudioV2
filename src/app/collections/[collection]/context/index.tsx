'use client';

import React, { createContext, useContext } from 'react';
import type { CollectionConfiguration } from '@/server/service/mongo/types';

type CollectionContext = {
    selectedCollection: CollectionConfiguration['_id'];
    cacheStrategy: CollectionConfiguration['config']['cacheStrategy'];
    logos: CollectionConfiguration['config']['logos'];
    unsupportedTraits: CollectionConfiguration['config']['unsupportedTraits'];
    paylinkId: CollectionConfiguration['config']['paylinkId'];
};

const Context = createContext({});

export const CollectionContextProvider = ({
    configuration,
    children
}: {
    configuration: CollectionConfiguration;
    children: React.ReactNode;
}) => {
    const {
        _id: selectedCollection,
        config: { logos, unsupportedTraits, cacheStrategy, paylinkId }
    } = configuration;

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

export const useCollectionContext = () => useContext(Context) as CollectionContext;
