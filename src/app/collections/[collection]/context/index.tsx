'use client';

import React, { createContext, useContext } from 'react';
import type { CollectionWithRelations } from '@/server/service/data/types';

type CollectionContext = {
    selectedCollection: CollectionWithRelations['name'];
    paylinkId: CollectionWithRelations['paylinkId'];
    cacheStrategy: {
        maxAge?: CollectionWithRelations['cacheStrategyMaxAge'];
        sMaxAge?: CollectionWithRelations['cacheStrategySMaxAge'];
    };
    logos: CollectionWithRelations['logos'];
    unsupportedTraits: CollectionWithRelations['unsupportedTraits'];
};

const Context = createContext({});

export const CollectionContextProvider = ({
    configuration,
    children
}: {
    configuration: CollectionWithRelations;
    children: React.ReactNode;
}) => {
    const {
        name: selectedCollection,
        paylinkId,
        cacheStrategyMaxAge,
        cacheStrategySMaxAge,
        logos,
        unsupportedTraits
    } = configuration;

    const context = {
        selectedCollection,
        paylinkId:
            process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
                ? paylinkId
                : process.env.NEXT_PUBLIC_PAYLINK_ID,
        cacheStrategy: { maxAge: cacheStrategyMaxAge, sMaxAge: cacheStrategySMaxAge },
        logos,
        unsupportedTraits
    };

    return <Context.Provider value={context}>{children}</Context.Provider>;
};

export const useCollectionContext = () => useContext(Context) as CollectionContext;
