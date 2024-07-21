import React from 'react';
import { Image } from '@/components/atoms';
import { cn } from '@/lib/utils';
import { GALLERY_IMAGES } from '@/shared/enums';

const { MOBILE, DESKTOP, BANNER } = GALLERY_IMAGES;

interface GalleryProps {
    className: string;
}

const getSrc = (src: string) => `https://images.ctfassets.net/ze23ubzzqb1s/${src}`;

export const Gallery = ({ className }: GalleryProps) => {
    return (
        <div className={cn('relative flex overflow-hidden', className)}>
            <div className="absolute left-0 z-10 h-full w-1/6 bg-gradient-to-r from-background to-65%" />

            <div className="flex min-w-full animate-loop-scroll">
                <GalleryStructure />
            </div>

            <div className="flex min-w-full animate-loop-scroll" aria-hidden>
                <GalleryStructure />
            </div>

            <div className="absolute right-0 z-10 h-full w-1/6 bg-gradient-to-l from-background to-65%" />
        </div>
    );
};

const GalleryStructure = () => {
    return (
        <>
            <div className="flex w-1/2 flex-wrap">
                <div className="w-1/2 p-1 md:p-2">
                    <Image
                        optimizedWidth={500}
                        alt="gallery"
                        className="rounded-md"
                        src={getSrc(MOBILE[0])}
                        useCustomLoader={false}
                        width={278.4}
                        height={391.94}
                    />
                </div>
                <div className="w-1/2 p-1 md:p-2">
                    <Image
                        optimizedWidth={500}
                        alt="gallery"
                        className="rounded-md"
                        src={getSrc(MOBILE[1])}
                        useCustomLoader={false}
                        width={278.4}
                        height={391.94}
                    />
                </div>
                <div className="w-full p-1 md:p-2">
                    <Image
                        optimizedWidth={500}
                        alt="gallery"
                        className="rounded-md"
                        src={getSrc(DESKTOP[0])}
                        useCustomLoader={false}
                        width={572.8}
                        height={322.2}
                    />
                </div>
            </div>
            <div className="flex w-1/2 flex-wrap">
                <div className="w-full p-1 md:p-2">
                    <Image
                        optimizedWidth={500}
                        alt="gallery"
                        className="rounded-md"
                        src={getSrc(BANNER[0])}
                        useCustomLoader={false}
                        width={572.8}
                        height={190.93}
                    />
                </div>
                <div className="w-full p-1 md:p-2">
                    <Image
                        optimizedWidth={500}
                        alt="gallery"
                        className="rounded-md"
                        src={getSrc(DESKTOP[0])}
                        useCustomLoader={false}
                        width={572.8}
                        height={322.2}
                    />
                </div>
                <div className="w-full p-1 md:p-2">
                    <Image
                        optimizedWidth={500}
                        alt="gallery"
                        className="rounded-md"
                        src={getSrc(BANNER[0])}
                        useCustomLoader={false}
                        width={572.8}
                        height={190.93}
                    />
                </div>
            </div>
        </>
    );
};
