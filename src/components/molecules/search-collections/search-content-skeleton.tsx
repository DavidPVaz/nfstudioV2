import { Skeleton } from '@/components/atoms/skeleton';

export const SearchContentSkeleton = () => (
    <div className="z-50 flex min-w-full flex-col">
        <div className="flex items-center border-b px-3">
            <div className="flex h-12 w-full px-2 py-3 2xs:px-0 2xs:pl-2 2xs:pr-10">
                <Skeleton className="flex h-full w-full" />
            </div>
        </div>
        <div className="flex items-center border-b px-3">
            <div className="flex h-12 w-full px-2 py-3">
                <Skeleton className="flex h-full w-full" />
            </div>
        </div>

        <div className="overflow-y-auto overflow-x-hidden 2xs:max-h-[300px]">
            <div className="flex flex-col overflow-hidden px-2 py-1.5">
                {Array.from({ length: 10 }, (_, i) => (
                    <div
                        key={i}
                        className="relative flex h-[61.84px] flex-row items-center gap-x-4 rounded-sm px-2 py-1.5 text-sm outline-none"
                    >
                        <Skeleton className="h-[45.84px] w-[35px] rounded-sm" />
                        <Skeleton className="h-[25px] w-[120px] rounded-sm" />
                    </div>
                ))}
            </div>
        </div>
    </div>
);
