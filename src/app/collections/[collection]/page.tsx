import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { queryCollectionsData } from '@/server/service/mongo';
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
        projection: { _id: 1 }
    });

    return nfstudioCollections.map(({ _id: collection }) => ({ collection }));
}

const CollectionPage = async ({ params: { collection } }: Slug) => {
    const [selectedCollectionConfig] = await queryCollectionsData({
        filter: { _id: { $eq: collection } },
        projection: {
            config: 1,
            marketplace: 1,
            discord: 1,
            twitter: 1,
            website: 1
        }
    });

    if (!selectedCollectionConfig) {
        return redirect(PAGES.COLLECTIONS);
    }

    return (
        <CollectionContextProvider configuration={selectedCollectionConfig}>
            <Studio configuration={selectedCollectionConfig} />
        </CollectionContextProvider>
    );
};

export default CollectionPage;
