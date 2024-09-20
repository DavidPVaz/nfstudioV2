import React from 'react';
import { Card, CardTitle } from '@/components/atoms/card';
import { Image } from '@/components/atoms/image';
import { Skeleton } from '@/components/atoms/skeleton';
import { cn } from '@/lib/utils';

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
                `min-w-full transition-all ${selected ? 'bg-accent shadow-border-extension2' : ''} animate-in fade-in-70 hover:shadow-border-extension2`,
                className
            )}
            aria-label={`Select nft with id ${id}`}
            onClick={() => onClick(id)}
            asChild
        >
            <button className="relative flex cursor-pointer flex-col items-center gap-y-2 p-2 2xs:p-3 sm:p-4">
                <Image
                    width={178.82}
                    height={178.82}
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
    <Card className="min-w-full border animate-out fade-out-90" asChild>
        <div className="relative flex cursor-default flex-col items-center gap-y-2 p-2 2xs:p-3 sm:p-4">
            <Skeleton className="h-0 w-full pb-[100%]" />
            <Skeleton className="h-[16px] w-[48px] sm:h-[28px] sm:w-[54px]" />
        </div>
    </Card>
);
