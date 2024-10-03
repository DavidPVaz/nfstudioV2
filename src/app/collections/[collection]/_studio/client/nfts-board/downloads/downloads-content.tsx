import React, { useEffect, useMemo, useRef } from 'react';
import { Info } from 'lucide-react';
import { useStudioContext, type Download } from '@/app/collections/[collection]/_studio/client';
import { DownloadCard } from '@/components/molecules/card/download';

const NoDownloadsFound = () => (
    <div className="flex h-full w-full flex-col items-center justify-start gap-y-4 pt-10 2xs:justify-center 2xs:pt-0">
        <span className="relative text-center text-lg 2xs:text-xl">
            You still haven&#39;t created an image!
        </span>
        <span className="relative text-center">
            Make your first purchase, and your creation will be available here for download.
        </span>
    </div>
);

const prepareDownloads = (downloads: Download[]) =>
    downloads.map(({ name, data }) => ({
        name,
        href: window.URL.createObjectURL(new Blob([Buffer.from(data)], { type: 'image/png' }))
    }));

const Downloads = ({ downloads }: { downloads: Download[] }) => {
    const data = useRef<{ name: string; href: string }[]>(prepareDownloads(downloads));

    useEffect(() => () => data.current.forEach(({ href }) => window.URL.revokeObjectURL(href), []));

    return (
        <div className="relative flex flex-col gap-y-4 p-2 2xs:gap-y-8 2xs:p-4">
            <div className="flex flex-row items-center gap-2 bg-muted p-2">
                <Info className="h-10 w-10 2xs:h-7 2xs:w-7 lg:h-5 lg:w-5" />
                <div className="relative text-sm 2xs:text-base">
                    Click on your creations to download.
                </div>
            </div>

            <div className="grid w-full auto-rows-[10rem] grid-cols-2 gap-3 transition-all 2xs:auto-rows-[11rem] 2xs:grid-cols-3 md:auto-rows-[13rem] lg:auto-rows-[15rem] lg:grid-cols-4">
                {data.current.map(({ name, href }) => (
                    <DownloadCard key={name} name={name} href={href} />
                ))}
            </div>
        </div>
    );
};

export const DownloadsContent = () => {
    const { downloads } = useStudioContext();

    const Component = useMemo(
        () =>
            downloads.length === 0 ? NoDownloadsFound : () => <Downloads downloads={downloads} />,
        [downloads]
    );

    return <Component />;
};
