import React from 'react';
import Link from 'next/link';
import { Card, CardTitle, Image } from '@/components/atoms';
import { cn } from '@/lib/utils';

interface CardProps {
    className?: string;
    imgSrc: string;
    imgAlt: string;
    href: string;
}

export const NFTCard = ({ className, imgSrc, href, imgAlt }: CardProps) => (
    <Card
        className={cn(
            'transition-all will-change-transform hover:-translate-y-1 hover:shadow-border-extension',
            className
        )}
        asChild
    >
        <Link className="flex flex-col gap-y-2 p-2 sm:p-4" href={href}>
            <Image
                width={350}
                height={492}
                className="rounded-lg"
                src={imgSrc}
                alt={imgAlt}
                optimizedWidth={300}
                useCustomLoader={false}
            />
            <CardTitle className="text-center">NAME</CardTitle>
        </Link>
    </Card>
);
