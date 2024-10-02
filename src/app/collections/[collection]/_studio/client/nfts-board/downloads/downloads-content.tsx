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
    downloads.map(({ name, data }) => {
        const buffer = Buffer.from(data);

        return {
            name,
            imgSrc: `data:image/png;base64,${buffer.toString('base64')}`,
            href: window.URL.createObjectURL(new Blob([buffer], { type: 'image/png' }))
        };
    });

const Downloads = ({ downloads }: { downloads: Download[] }) => {
    const data = useRef<{ name: string; imgSrc: string; href: string }[]>(
        prepareDownloads(downloads)
    );

    useEffect(() => () => data.current.forEach(({ href }) => window.URL.revokeObjectURL(href), []));

    return (
        <div className="relative flex flex-col gap-y-4 p-2 2xs:gap-y-8 2xs:p-4">
            <div className="flex flex-row items-center gap-2 bg-muted p-2">
                <Info className="h-10 w-10 2xs:h-7 2xs:w-7 lg:h-5 lg:w-5" />
                <div className="relative text-sm 2xs:text-base">
                    Click on your creations to download.
                </div>
            </div>

            <div className="grid w-full auto-rows-[14rem] grid-cols-2 gap-3 transition-all md:grid-cols-3 lg:grid-cols-4">
                <div className="relative flex h-full w-full">
                    {data.current.map(({ name, imgSrc, href }) => (
                        <DownloadCard key={name} name={name} imgSrc={imgSrc} href={href} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export const DownloadsContent = () => {
    const { download } = useStudioContext();

    const Component = useMemo(
        () => (!download ? NoDownloadsFound : () => <Downloads downloads={[download]} />),
        [download]
    );

    return <Component />;
};
