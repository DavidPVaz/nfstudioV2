import React from 'react';
import { type Collection } from '@/server/service/data/types';
import { type Chain } from '@/enums';
import { CollectionCard } from '@/components/molecules/card/collection';

export const Collections = ({ children }: { children: React.ReactElement }) => (
    <div className="grid w-full grid-cols-1 gap-3 xs:grid-cols-2 2xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {children}
    </div>
);

export const CollectionsList = ({ collections }: { collections: Collection[] }) =>
    collections.map(({ name, chain, presentationPictureUrl }) => (
        <CollectionCard
            key={name}
            imgSrc={presentationPictureUrl}
            href={`/collections/${name}`}
            chain={chain as Chain}
            name={name}
        />
    ));
