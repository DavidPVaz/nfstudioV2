import { redirect } from 'next/navigation';
import { queryCollectionsData } from '@/server/service/mongo';

export async function generateStaticParams() {
    const nfstudioCollections = await queryCollectionsData({
        projection: { _id: 1 }
    });

    return nfstudioCollections.map(({ _id: collection }) => ({ collection }));
}

const CollectionPage = async ({ params: { collection } }: { params: { collection: string } }) => {
    const [selectedCollection] = await queryCollectionsData({
        filter: { _id: { $eq: collection } },
        projection: { config: 1 }
    });

    // No active `selectedCollection` -> no page for it
    if (!selectedCollection) {
        return redirect('/collections');
    }

    return <div>{JSON.stringify(selectedCollection)}</div>;
};

export default CollectionPage;
