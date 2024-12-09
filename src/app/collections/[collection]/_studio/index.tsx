import React from 'react';
import type { CollectionWithRelations } from '@/server/service/data/types';
import { Button } from '@/components/atoms/button';
import { default as MarketplaceIcon } from '@/resources/MarketplaceIcon.svg';
import { default as DiscordIcon } from '@/resources/DiscordIcon.svg';
import { default as TwitterIcon } from '@/resources/TwitterIcon.svg';
import { default as WebsiteIcon } from '@/resources/WebsiteIcon.svg';
import { StudioContent } from '@/app/collections/[collection]/_studio/client';

export const Studio = ({ configuration }: { configuration: CollectionWithRelations }) => {
    const { name, marketplaceUrl, discordUrl, twitterUrl, websiteUrl } = configuration;
    const normalized = name.replace('_', ' ');

    return (
        <div className="relative flex min-w-full flex-col items-center justify-start gap-y-5 duration-300 animate-in fade-in-0 md:gap-y-8">
            <section className="relative mt-2 flex w-full flex-row flex-wrap justify-between gap-1 xs:items-center 2xs:justify-start 2xs:gap-3 sm:w-4/5">
                <h2 className="text-start text-2xl leading-none text-foreground sm:text-3xl">
                    {normalized}
                </h2>
                <div className="relative flex flex-row">
                    <Button variant="ghost" size="icon" asChild>
                        <a href={marketplaceUrl} rel="noopener noreferrer" target={'_blank'}>
                            <MarketplaceIcon className="h-[1.3rem] w-[1.3rem] fill-current sm:h-[1.6rem] sm:w-[1.6rem]" />
                            <span className="sr-only">{`Buy ${normalized} NFTs`}</span>
                        </a>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                        <a href={discordUrl} rel="noopener noreferrer" target={'_blank'}>
                            <DiscordIcon className="h-[1.4rem] w-[1.4rem] fill-current sm:h-[1.6rem] sm:w-[1.6rem]" />
                            <span className="sr-only">{`Go to ${normalized} discord`}</span>
                        </a>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                        <a href={twitterUrl} rel="noopener noreferrer" target={'_blank'}>
                            <TwitterIcon className="h-[.9rem] w-[.9rem] fill-current sm:h-[1rem] sm:w-[1rem]" />
                            <span className="sr-only">{`Go to ${normalized} twitter account`}</span>
                        </a>
                    </Button>
                    {websiteUrl && (
                        <Button variant="ghost" size="icon" asChild>
                            <a href={websiteUrl} rel="noopener noreferrer" target={'_blank'}>
                                <WebsiteIcon className="h-[1.3rem] w-[1.3rem] fill-current sm:h-[1.6rem] sm:w-[1.6rem]" />
                                <span className="sr-only">{`Go to ${normalized} website`}</span>
                            </a>
                        </Button>
                    )}
                </div>
            </section>
            <section className="relative flex max-h-[75vh] min-h-[75vh] w-full rounded-lg border sm:w-4/5">
                <StudioContent />
            </section>
        </div>
    );
};
