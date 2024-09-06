import React from 'react';
import type { CollectionConfiguration } from '@/server/service/mongo/types';

type CollectionLinks = {
    collection: CollectionConfiguration['_id'];
    links: {
        marketplace: CollectionConfiguration['marketplace'];
        discord: CollectionConfiguration['discord'];
        twitter: CollectionConfiguration['twitter'];
        website?: CollectionConfiguration['website'];
    };
};

export const Studio = ({ collection, links }: CollectionLinks) => {
    return (
        <div className="relative flex min-w-full flex-col items-center justify-start gap-y-12 md:gap-y-20">
            <section className="relative flex min-w-full flex-col gap-3 sm:min-w-[80%] sm:flex-row md:min-w-[90%]">
                <h2 className="text-start text-base leading-none text-foreground sm:text-xl">
                    {collection}
                </h2>
                <div>{JSON.stringify(links)}</div>
            </section>
            <div className="relative flex min-w-full border sm:min-w-[80%] md:min-w-[90%]"></div>
        </div>
    );
};
