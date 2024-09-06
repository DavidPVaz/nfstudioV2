'use client';

import React, { createContext } from 'react';
import type { CollectionConfiguration } from '@/server/service/mongo/types';

const Context = createContext({});

const StudioContextProvider = ({
    collectionConfiguration,
    children
}: {
    collectionConfiguration: CollectionConfiguration;
    children: React.ReactNode;
}) => {
    const {
        config: { logos, unsupportedTraits, cacheStrategy, paylinkId }
    } = collectionConfiguration;

    const context = {
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

export default Context;
export { StudioContextProvider };
