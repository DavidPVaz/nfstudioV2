import { Skeleton } from '@/components/atoms/skeleton';

export const HelpContentSkeleton = () => (
    <div className="relative flex h-full w-full flex-col gap-y-6">
        <div className="relative flex py-3 pl-6 md:py-5">
            <Skeleton className="min-h-[60px] w-full 2xs:min-h-[48px] md:min-h-[64px]" />
        </div>
        <div className="relative flex flex-col gap-y-4">
            <Skeleton className="min-h-24 w-full 2xs:min-h-14 sm:min-h-16" />
            <Skeleton className="min-h-24 w-full 2xs:min-h-14 sm:min-h-16" />
            <Skeleton className="min-h-24 w-full 2xs:min-h-14 sm:min-h-16" />
            <Skeleton className="min-h-24 w-full 2xs:min-h-14 sm:min-h-16" />
            <Skeleton className="min-h-24 w-full 2xs:min-h-14 sm:min-h-16" />
            <Skeleton className="min-h-24 w-full 2xs:min-h-14 sm:min-h-16" />
            <Skeleton className="min-h-24 w-full 2xs:min-h-14 sm:min-h-16" />
            <Skeleton className="min-h-24 w-full 2xs:min-h-14 sm:min-h-16" />
        </div>
    </div>
);
