import React from 'react';
import { Card } from '@/components/atoms/card';
import { Image } from '@/components/atoms/image';
import { cn } from '@/lib/utils';

type DownloadCardProps = {
    className?: string;
    href: string;
    name: string;
};

export const DownloadCard = ({ className, href, name }: DownloadCardProps) => (
    <Card
        className={cn(
            'min-w-full transition-all hover:bg-muted hover:shadow-border-extension',
            className
        )}
        asChild
    >
        <a
            className="relative flex items-center p-2 sm:p-4"
            aria-label={`Download ${name}`}
            href={href}
            download={name}
        >
            <div className="relative flex max-h-full max-w-full">
                <Image
                    variant={'fill_contain'}
                    className="rounded-none"
                    src={href}
                    alt={`${name} download card`}
                    useCustomLoader={false}
                />
            </div>
        </a>
    </Card>
);
