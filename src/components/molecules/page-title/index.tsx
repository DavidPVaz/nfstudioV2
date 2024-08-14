import React from 'react';
import { cn } from '@/lib/utils';

export const PageTitle = ({ className, title }: { className?: string; title: string }) => (
    <h1
        className={cn(
            'py-3 text-center text-2xl leading-none text-foreground 2xs:text-3xl md:py-5 lg:text-5xl',
            className
        )}
    >
        {title}
    </h1>
);
