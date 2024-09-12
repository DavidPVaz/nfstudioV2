import React from 'react';
import { type CollectionConfiguration } from '@/server/service/mongo/types';
import { CollectionCard } from '@/components/molecules';

export const Collections = ({ children }: { children: React.ReactElement }) => (
    <div className="grid w-full grid-cols-1 gap-3 xs:grid-cols-2 2xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {children}
    </div>
);

export const CollectionsList = ({ collections }: { collections: CollectionConfiguration[] }) =>
    collections.map(({ _id, chain, presentation }) => (
        <CollectionCard
            key={_id}
            imgSrc={presentation}
            href={`/collections/${_id}`}
            chain={chain}
            name={_id}
        />
    ));
