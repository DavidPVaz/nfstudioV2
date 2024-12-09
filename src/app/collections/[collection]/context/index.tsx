'use client';

import React, { createContext, useContext } from 'react';
import type {
    CollectionWithRelations,
    Collection,
    UnsupportedTraits
} from '@/server/service/data/types';

type CollectionContext = {
    selectedCollection: Collection['name'];
    paylinkId: Collection['paylinkId'];
    cacheStrategy: {
        maxAge?: Collection['cacheStrategyMaxAge'];
        sMaxAge?: Collection['cacheStrategySMaxAge'];
    };
    logos: string[];
    unsupportedTraits: UnsupportedTraits[];
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
        logos: logos?.map(({ url }) => url),
        unsupportedTraits
    };

    return <Context.Provider value={context}>{children}</Context.Provider>;
};

export const useCollectionContext = () => useContext(Context) as CollectionContext;
