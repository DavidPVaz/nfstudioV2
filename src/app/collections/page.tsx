import React from 'react';
import { Collections, CollectionsList } from '@/components/organisms';
import { SearchCollections } from '@/components/molecules';

import { queryCollectionsData } from '@/server/service/mongo';

const CollectionsPage = async () => {
    const collections = await queryCollectionsData({
        projection: { _id: 1, presentation: 1, chain: 1 }
    });

    return (
        <div className="relative flex w-full flex-col items-start justify-start gap-y-12 md:gap-y-20">
            <section className="relative flex w-full flex-col 2xs:w-fit">
                <h1 className="py-3 text-center text-2xl text-foreground 2xs:text-start 2xs:text-3xl md:py-5 lg:text-5xl">
                    PICK A COLLECTION
                </h1>

                <SearchCollections collections={collections} />
            </section>

            <Collections>
                <CollectionsList collections={collections} />
            </Collections>
        </div>
    );
};
export default CollectionsPage;
