import React from 'react';
import { Image } from '@/components/atoms';
import { cn } from '@/lib/utils';
import { GALLERY_IMAGES } from '@/shared/enums';

const { MOBILE, DESKTOP, BANNER } = GALLERY_IMAGES;

interface GalleryProps {
    className: string;
}

// will be removed
const getSrc = (src: string) => `https://images.ctfassets.net/ze23ubzzqb1s/${src}`;

export const Gallery = ({ className }: GalleryProps) => (
    <div className={cn('relative flex overflow-hidden', className)}>
        <div className="absolute left-0 z-10 h-full w-1/6 bg-gradient-to-r from-background to-65%" />
        <div className="absolute right-0 z-10 h-full w-1/6 bg-gradient-to-l from-background to-65%" />

        <Images />
    </div>
);

type LeftPageData = {
    mobileSrcOne: string;
    mobileSrcTwo: string;
    desktopSrc: string;
};
type RightPageData = {
    bannerSrcOne: string;
    bannerSrcTwo: string;
    desktopSrc: string;
};
type GallerySrcData = {
    [page: string]: { left: LeftPageData; right: RightPageData };
};
const NUMBER_OF_GALLERY_PAGES = 4;

const gallery_src_data = Array.from(
    { length: NUMBER_OF_GALLERY_PAGES },
    value => value
).reduce<GallerySrcData>((acc, _, index) => {
    const step = index * 2;

    const [mobileSrcOne, mobileSrcTwo] = MOBILE.slice(step, step + 2);
    const [desktopSrcOne, desktopSrcTwo] = DESKTOP.slice(step, step + 2);
    const [bannerSrcOne, bannerSrcTwo] = BANNER.slice(step, step + 2);

    return {
        ...acc,
        [`page-${index + 1}`]: {
            left: { mobileSrcOne, mobileSrcTwo, desktopSrc: desktopSrcOne },
            right: { bannerSrcOne, bannerSrcTwo, desktopSrc: desktopSrcTwo }
        }
    };
}, {});

const Images = () => (
    <>
        {Object.entries(gallery_src_data).map(([key, { left, right }]) => (
            <div key={key} className="flex min-w-full animate-loop-scroll">
                <LeftPage {...left} />
                <RightPage {...right} />
            </div>
        ))}
        {Object.entries(gallery_src_data).map(([key, { left, right }]) => (
            <div
                key={`${key}-repeated`}
                className="flex min-w-full animate-loop-scroll"
                aria-hidden
            >
                <LeftPage {...left} />
                <RightPage {...right} />
            </div>
        ))}
    </>
);

const LeftPage = ({ mobileSrcOne, mobileSrcTwo, desktopSrc }: LeftPageData) => (
    <div className="flex w-1/2 flex-wrap">
        <div className="w-1/2 p-1 md:p-2">
            <Image
                optimizedWidth={279}
                alt="gallery"
                className="rounded-lg"
                src={getSrc(mobileSrcOne)}
                useCustomLoader={false}
                width={278.4}
                height={391.94}
            />
        </div>
        <div className="w-1/2 p-1 md:p-2">
            <Image
                optimizedWidth={279}
                alt="gallery"
                className="rounded-lg"
                src={getSrc(mobileSrcTwo)}
                useCustomLoader={false}
                width={278.4}
                height={391.94}
            />
        </div>
        <div className="w-full p-1 md:p-2">
            <Image
                optimizedWidth={573}
                alt="gallery"
                className="rounded-lg"
                src={getSrc(desktopSrc)}
                useCustomLoader={false}
                width={572.8}
                height={322.2}
            />
        </div>
    </div>
);

const RightPage = ({ bannerSrcOne, bannerSrcTwo, desktopSrc }: RightPageData) => (
    <div className="flex w-1/2 flex-wrap">
        <div className="w-full p-1 md:p-2">
            <Image
                optimizedWidth={573}
                alt="gallery"
                className="rounded-lg"
                src={getSrc(bannerSrcOne)}
                useCustomLoader={false}
                width={572.8}
                height={190.93}
            />
        </div>
        <div className="w-full p-1 md:p-2">
            <Image
                optimizedWidth={573}
                alt="gallery"
                className="rounded-lg"
                src={getSrc(desktopSrc)}
                useCustomLoader={false}
                width={572.8}
                height={322.2}
            />
        </div>
        <div className="w-full p-1 md:p-2">
            <Image
                optimizedWidth={573}
                alt="gallery"
                className="rounded-lg"
                src={getSrc(bannerSrcTwo)}
                useCustomLoader={false}
                width={572.8}
                height={190.93}
            />
        </div>
    </div>
);
