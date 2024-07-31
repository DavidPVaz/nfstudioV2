'use client';

import React from 'react';
import { type CollectionConfiguration } from '@/server/service/mongo/types';
import { CollectionCard } from '@/components/molecules';

export const CollectionsList = ({ collections }: { collections: CollectionConfiguration[] }) =>
    collections.map(({ _id, chain, presentation }) => (
        <CollectionCard
            imgAlt={`${_id} card`}
            key={_id}
            imgSrc={`https://images.ctfassets.net/ze23ubzzqb1s/${presentation}`}
            href={`/collections/${_id}`}
            chain={chain}
            name={_id}
        />
    ));
