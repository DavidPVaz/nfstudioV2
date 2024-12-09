import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { queryCollectionsData } from '@/server/service/data';
import { PAGES } from '@/enums';
import { CollectionContextProvider } from '@/app/collections/[collection]/context';
import { Studio } from '@/app/collections/[collection]/_studio';

type Slug = {
    params: { collection: string };
};

export function generateMetadata({ params: { collection } }: Slug): Metadata {
    const title = `${collection.replace('_', ' ')} | NFStudio`;

    return {
        title,
        alternates: {
            canonical: PAGES.COLLECTIONS
        }
    };
}

export async function generateStaticParams() {
    const nfstudioCollections = await queryCollectionsData({
        select: 'name'
    });

    return nfstudioCollections.map(({ name: collection }) => ({ collection }));
}

const CollectionPage = async ({ params: { collection } }: Slug) => {
    const [selectedCollection] = await queryCollectionsData({
        limit: 1,
        select: [
            'name',
            'marketplaceUrl',
            'discordUrl',
            'twitterUrl',
            'websiteUrl',
            'paylinkId',
            'cacheStrategySMaxAge',
            'cacheStrategyMaxAge'
        ],
        filter: { eq: { name: collection } },
        relation: ['logos', 'unsupportedTraits']
    });

    if (!selectedCollection) {
        return redirect(PAGES.COLLECTIONS);
    }

    return (
        <CollectionContextProvider configuration={selectedCollection}>
            <Studio configuration={selectedCollection} />
        </CollectionContextProvider>
    );
};

export default CollectionPage;
