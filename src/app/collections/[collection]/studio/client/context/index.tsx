'use client';

import React, { createContext, useContext } from 'react';
import type { CollectionConfiguration } from '@/server/service/mongo/types';

type StudioContext = {
    id: CollectionConfiguration['_id'];
    cacheStrategy: CollectionConfiguration['config']['cacheStrategy'];
    logos: CollectionConfiguration['config']['logos'];
    unsupportedTraits: CollectionConfiguration['config']['unsupportedTraits'];
    paylinkId: CollectionConfiguration['config']['paylinkId'];
};

const Context = createContext({});

const StudioContextProvider = ({
    collectionConfiguration,
    children
}: {
    collectionConfiguration: CollectionConfiguration;
    children: React.ReactNode;
}) => {
    const {
        _id,
        config: { logos, unsupportedTraits, cacheStrategy, paylinkId }
    } = collectionConfiguration;

    const context = {
        id: _id,
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

const useStudioContext = () => useContext(Context) as StudioContext;

export { StudioContextProvider, useStudioContext };
