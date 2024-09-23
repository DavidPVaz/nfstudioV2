import React from 'react';
import { Skeleton } from '@/components/atoms/skeleton';
import { default as NFStudioIcon } from '@/resources/NFStudioIcon.svg';

export const NFStudioSkeleton = () => (
    <Skeleton className="flex min-h-full w-full items-center justify-center">
        <NFStudioIcon className="h-[30%] w-auto fill-primary-brand" />
    </Skeleton>
);
