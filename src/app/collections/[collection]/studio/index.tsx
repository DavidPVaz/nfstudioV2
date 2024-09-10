import React from 'react';
import type { CollectionConfiguration } from '@/server/service/mongo/types';
import { Button } from '@/components/atoms/button';
import { MarketplaceIcon, DiscordIcon, TwitterIcon, WebsiteIcon } from '@/resources';
import { StudioClientContent } from '@/app/collections/[collection]/studio/client';

export const Studio = ({
    collectionConfiguration
}: {
    collectionConfiguration: CollectionConfiguration;
}) => {
    const { _id, marketplace, discord, twitter, website } = collectionConfiguration;
    const name = _id.replace('_', ' ');

    return (
        <div className="relative flex min-w-full flex-col items-center justify-start gap-y-5 duration-300 animate-in fade-in-0 md:gap-y-8">
            <section className="relative mt-2 flex w-full flex-row flex-wrap justify-between gap-1 xs:items-center 2xs:justify-start 2xs:gap-3 sm:w-4/5">
                <h2 className="text-start text-2xl leading-none text-foreground sm:text-3xl">
                    {name}
                </h2>
                <div className="relative flex flex-row">
                    <Button variant="ghost" size="icon" asChild>
                        <a href={marketplace} rel="noopener noreferrer" target={'_blank'}>
                            <MarketplaceIcon className="h-[1.3rem] w-[1.3rem] fill-current sm:h-[1.6rem] sm:w-[1.6rem]" />
                            <span className="sr-only">{`Buy ${name} NFTs`}</span>
                        </a>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                        <a href={discord} rel="noopener noreferrer" target={'_blank'}>
                            <DiscordIcon className="h-[1.4rem] w-[1.4rem] fill-current sm:h-[1.6rem] sm:w-[1.6rem]" />
                            <span className="sr-only">{`Go to ${name} discord`}</span>
                        </a>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                        <a href={twitter} rel="noopener noreferrer" target={'_blank'}>
                            <TwitterIcon className="h-[.9rem] w-[.9rem] fill-current sm:h-[1rem] sm:w-[1rem]" />
                            <span className="sr-only">{`Go to ${name} twitter account`}</span>
                        </a>
                    </Button>
                    {website && (
                        <Button variant="ghost" size="icon" asChild>
                            <a href={website} rel="noopener noreferrer" target={'_blank'}>
                                <WebsiteIcon className="h-[1.3rem] w-[1.3rem] fill-current sm:h-[1.6rem] sm:w-[1.6rem]" />
                                <span className="sr-only">{`Go to ${name} website`}</span>
                            </a>
                        </Button>
                    )}
                </div>
            </section>
            <section className="relative flex max-h-[75vh] min-h-[75vh] w-full rounded-lg border sm:w-4/5">
                <StudioClientContent />
            </section>
        </div>
    );
};
