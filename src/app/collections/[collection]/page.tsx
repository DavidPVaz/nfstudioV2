import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { queryCollectionsData } from '@/server/service/mongo';
import { PAGES } from '@/enums';
import { StudioContextProvider } from '@/app/collections/[collection]/_studio/client/context';
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
    const [selectedCollection] = await queryCollectionsData({
        filter: { _id: { $eq: collection } },
        projection: {
            config: 1,
            marketplace: 1,
            discord: 1,
            twitter: 1,
            website: 1
        }
    });

    if (!selectedCollection) {
        return redirect(PAGES.COLLECTIONS);
    }

    return (
        <StudioContextProvider collectionConfiguration={selectedCollection}>
            <Studio collectionConfiguration={selectedCollection} />
        </StudioContextProvider>
    );
};

export default CollectionPage;
