import React from 'react';
import { Collections, CollectionsList } from '@/components/organisms';
import { SearchCollections, PageTitle } from '@/components/molecules';
import { queryCollectionsData } from '@/server/service/mongo';

const CollectionsPage = async () => {
    const collections = await queryCollectionsData({
        projection: { _id: 1, presentation: 1, chain: 1 }
    });

    return (
        <div className="relative flex w-full flex-col items-start justify-start gap-y-12 md:gap-y-20">
            <section className="relative flex w-full flex-col 2xs:w-fit">
                <PageTitle title="PICK A COLLECTION" />
                <SearchCollections collections={collections} />
            </section>

            <section className="relative w-full 2xs:w-fit">
                <Collections>
                    <CollectionsList collections={collections} />
                </Collections>
            </section>
        </div>
    );
};
export default CollectionsPage;
