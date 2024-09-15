import { cn } from '@/lib/utils';

const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('animate-pulse rounded-lg bg-accent', className)} {...props} />
);

export { Skeleton };
