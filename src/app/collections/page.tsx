import type { Metadata } from 'next';
import React from 'react';
import { Collections, CollectionsList } from '@/components/organisms';
import { PageTitle } from '@/components/molecules/page-title';
import { SearchCollections } from '@/components/molecules/search-collections';
import { queryCollectionsData } from '@/server/service/mongo';

const title = 'Collections | NFStudio';

export const metadata: Metadata = {
    title
};

const CollectionsPage = async () => {
    const collections = await queryCollectionsData({
        projection: { _id: 1, presentation: 1, chain: 1 }
    });

    return (
        <div className="relative flex w-full flex-col items-start justify-start gap-y-12 duration-300 animate-in fade-in-0 md:gap-y-20">
            <section className="relative flex w-full flex-col 2xs:w-fit">
                <PageTitle title="PICK A COLLECTION" className="2xs:text-start" />
                <SearchCollections collections={collections} />
            </section>

            <section className="relative w-full">
                <Collections>
                    <CollectionsList collections={collections} />
                </Collections>
            </section>
        </div>
    );
};

export default CollectionsPage;
