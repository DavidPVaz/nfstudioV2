import React from 'react';
import Link from 'next/link';
import { type Chain } from '@/enums';
import { Card, CardTitle } from '@/components/atoms/card';
import { Image } from '@/components/atoms/image';
import { cn } from '@/lib/utils';
import { ChainIcon } from '@/components/molecules/card/collection/chain-icon';

type CollectionCardProps = {
    className?: string;
    imgSrc: string;
    href: string;
    chain: Chain;
    name: string;
};

export const CollectionCard = ({ className, imgSrc, href, chain, name }: CollectionCardProps) => (
    <Card
        className={cn(
            'min-w-full transition-all will-change-transform hover:-translate-y-1 hover:shadow-border-extension',
            className
        )}
        asChild
    >
        <Link
            className="relative flex flex-col gap-y-2 p-2 sm:p-4"
            href={href}
            aria-label={`Go to ${name.replace('_', ' ')} collection page`}
        >
            <div className="absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-primary-brand bg-white sm:left-6 sm:top-6 sm:h-10 sm:w-10">
                <ChainIcon chain={chain} className={'fill-primary-brand'} />
            </div>
            <Image
                width={201.33}
                height={263.73}
                className="rounded-lg"
                src={imgSrc}
                alt={`${name} card`}
                optimizedWidth={300}
                quality={30}
            />
            <CardTitle className="text-center">{`${name.replace('_', ' ')}`}</CardTitle>
        </Link>
    </Card>
);
