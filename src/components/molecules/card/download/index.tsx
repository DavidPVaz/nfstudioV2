import React from 'react';
import { Card } from '@/components/atoms/card';
import { Image } from '@/components/atoms/image';
import { cn } from '@/lib/utils';

type DownloadCardProps = {
    className?: string;
    imgSrc: string;
    href: string;
    name: string;
};

export const DownloadCard = ({ className, imgSrc, href, name }: DownloadCardProps) => (
    <Card
        className={cn(
            'min-w-full transition-all hover:bg-muted hover:shadow-border-extension',
            className
        )}
        asChild
    >
        <a
            className="relative flex flex-col gap-y-2 p-2 sm:p-4"
            aria-label={`Download ${name}`}
            href={href}
            download={name}
        >
            <Image
                variant={'fill_contain'}
                className="rounded-lg"
                src={imgSrc}
                alt={`${name} download card`}
                useCustomLoader={false}
            />
        </a>
    </Card>
);
