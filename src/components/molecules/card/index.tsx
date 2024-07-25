import React from 'react';
import Link from 'next/link';
import { type Chain } from '@/shared/enums';
import { Card, CardTitle, Image } from '@/components/atoms';
import { cn } from '@/lib/utils';
import { ChainIcon } from './chain-icon';

interface CardProps {
    className?: string;
    imgSrc: string;
    imgAlt: string;
    href: string;
    chain: Chain;
    name: string;
}

export const CollectionCard = ({ className, imgSrc, href, imgAlt, chain, name }: CardProps) => (
    <Card
        className={cn(
            'transition-all will-change-transform hover:-translate-y-1 hover:shadow-border-extension',
            className
        )}
        asChild
    >
        <Link className="relative flex flex-col gap-y-2 p-2 sm:p-4" href={href}>
            <div className="absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border bg-white sm:left-6 sm:top-6 sm:h-10 sm:w-10">
                <ChainIcon chain={chain} />
            </div>
            <Image
                variant={'contain'}
                width={350}
                height={492}
                className="rounded-lg"
                src={imgSrc}
                alt={imgAlt}
                optimizedWidth={300}
                useCustomLoader={false}
            />
            <CardTitle className="text-center">{`${name.replace('_', ' ')}`}</CardTitle>
        </Link>
    </Card>
);
