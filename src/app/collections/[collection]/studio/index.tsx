import React from 'react';
import type { CollectionConfiguration } from '@/server/service/mongo/types';
import { Button } from '@/components/atoms/button';
import { MarketplaceIcon, DiscordIcon, TwitterIcon, WebsiteIcon } from '@/resources';

type StudioRSCProps = {
    collection: CollectionConfiguration['_id'];
    links: {
        marketplace: CollectionConfiguration['marketplace'];
        discord: CollectionConfiguration['discord'];
        twitter: CollectionConfiguration['twitter'];
        website?: CollectionConfiguration['website'];
    };
};

export const Studio = ({ collection, links }: StudioRSCProps) => (
    <div className="relative flex min-w-full flex-col items-center justify-start gap-y-5 md:gap-y-8">
        <CollectionIdentification collection={collection.replace('_', ' ')} links={links} />
        <section className="relative flex max-h-[75vh] min-h-[75vh] w-full rounded-lg border sm:w-4/5">
            {/* client content */}
        </section>
    </div>
);

const CollectionIdentification = ({ collection, links }: StudioRSCProps) => (
    <section className="relative mt-2 flex w-full flex-col flex-wrap gap-1 xs:flex-row xs:items-center xs:gap-3 sm:w-4/5">
        <h2 className="text-start text-2xl leading-none text-foreground sm:text-3xl">
            {collection}
        </h2>
        <div className="relative flex flex-row">
            <Button variant="ghost" size="icon" asChild>
                <a href={links.marketplace} rel="noopener noreferrer" target={'_blank'}>
                    <MarketplaceIcon className="h-[1.25rem] w-[1.25rem] fill-current sm:h-[1.4rem] sm:w-[1.4rem]" />
                    <span className="sr-only">{`Buy ${collection} NFTs`}</span>
                </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
                <a href={links.discord} rel="noopener noreferrer" target={'_blank'}>
                    <DiscordIcon className="h-[1.25rem] w-[1.25rem] fill-current sm:h-[1.4rem] sm:w-[1.4rem]" />
                    <span className="sr-only">{`Go to ${collection} discord`}</span>
                </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
                <a href={links.twitter} rel="noopener noreferrer" target={'_blank'}>
                    <TwitterIcon className="h-[.9rem] w-[.9rem] fill-current sm:h-[1rem] sm:w-[1rem]" />
                    <span className="sr-only">{`Go to ${collection} twitter account`}</span>
                </a>
            </Button>
            {links.website && (
                <Button variant="ghost" size="icon" asChild>
                    <a href={links.website} rel="noopener noreferrer" target={'_blank'}>
                        <WebsiteIcon className="h-[1.25rem] w-[1.25rem] fill-current sm:h-[1.4rem] sm:w-[1.4rem]" />
                        <span className="sr-only">{`Go to ${collection} website`}</span>
                    </a>
                </Button>
            )}
        </div>
    </section>
);
