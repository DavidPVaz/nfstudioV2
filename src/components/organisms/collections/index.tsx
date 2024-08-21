import React from 'react';
import { type CollectionConfiguration } from '@/server/service/mongo/types';
import { CollectionCard } from '@/components/molecules';

export const Collections = ({ children }: { children: React.ReactElement }) => (
    <ul className="grid w-full grid-cols-1 gap-3 xs:grid-cols-2 2xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {children}
    </ul>
);

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
