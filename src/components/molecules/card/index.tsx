import React from 'react';
import Link from 'next/link';
import { type Chain } from '@/shared/enums';
import { Card, CardTitle, Image } from '@/components/atoms';
import { Skeleton } from '@/components/atoms/skeleton';
import { cn } from '@/lib/utils';
import { ChainIcon } from './chain-icon';

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
                quality={20}
            />
            <CardTitle className="text-center">{`${name.replace('_', ' ')}`}</CardTitle>
        </Link>
    </Card>
);

type NFTCardProps = {
    className?: string;
    imgSrc: string;
    id: number;
    selected: boolean;
    onClick: (id: number) => void;
    sMaxAge?: number;
    maxAge?: number;
};

export const NFTCard = React.memo(
    ({ className, imgSrc, id, selected, onClick, maxAge, sMaxAge }: NFTCardProps) => (
        <Card
            className={cn(
                `min-w-full transition-all ${selected ? 'bg-accent shadow-border-extension2' : ''} hover:shadow-border-extension2`,
                className
            )}
            aria-label={`Select nft with id ${id}`}
            onClick={() => onClick(id)}
            asChild
        >
            <button className="relative flex cursor-pointer flex-col items-center gap-y-2 p-2 2xs:p-3 sm:p-4">
                <Image
                    width={263.73}
                    height={263.73}
                    className="rounded-lg"
                    src={imgSrc}
                    alt={`NFT #${id}`}
                    optimizedWidth={800}
                    quality={50}
                    maxAge={maxAge}
                    sMaxAge={sMaxAge}
                />
                <CardTitle className="text-center">{`#${id}`}</CardTitle>
            </button>
        </Card>
    ),
    (previousProps, nextProps) => previousProps.selected === nextProps.selected
);

export const NFTCardSkeleton = () => (
    <Card className="min-w-full border" asChild>
        <div className="relative flex cursor-wait flex-col items-center gap-y-2 p-2 2xs:p-3 sm:p-4">
            <Skeleton className="relative h-0 w-full pb-[100%]" />
            <Skeleton className="flex h-[16px] w-[48px] sm:h-[28px] sm:w-[54px]" />
        </div>
    </Card>
);
