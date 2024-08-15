import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { PAGES, GALLERY_IMAGES } from '@/shared/enums';
import { Gallery, Collections } from '@/components/organisms';
import { Button, Image } from '@/components/atoms';
import { CreateButton } from './create-button';
import { NFStudioList } from './nfstudio-list';
import { queryCollectionsData } from '@/server/service/mongo';

const { MOBILE } = GALLERY_IMAGES;

const getSrc = (src: string) => `https://images.ctfassets.net/ze23ubzzqb1s/${src}`;

const HomePage = () => (
    <div className="relative flex w-full flex-col items-center justify-start gap-y-24 md:gap-y-36">
        <TopSection />
        <IntroSection />
        <CollectionsSection />
        <ShowcaseSection />
    </div>
);

export default HomePage;

const TopSection = () => (
    <section className="relative flex w-fit flex-row">
        <div className="hidden flex-col gap-y-6 p-2 md:flex md:w-1/5 lg:gap-y-20">
            <h1 className="hidden text-start text-2xl md:block md:text-3xl lg:text-5xl xl:text-6xl 3xl:text-7xl">
                Ultimate <strong>NFT</strong> <strong>Display</strong> <strong>Solution</strong>
            </h1>

            <CreateButton className="font-semibold lg:w-1/2" />
        </div>

        <Gallery className="md:w-4/5" />
    </section>
);

const IntroSection = () => (
    <section className="flex flex-col gap-y-24 md:gap-y-36">
        <div className="flex flex-col items-center gap-y-6 md:hidden">
            <h1 className="block text-center text-5xl">
                Ultimate <strong>NFT</strong> <strong>Display</strong> <strong>Solution</strong>
            </h1>

            <CreateButton className="w-44 font-semibold" />
        </div>

        <div className="flex flex-col gap-y-10">
            <h2 className="text-center text-3xl font-semibold leading-none sm:text-4xl lg:text-5xl xl:text-6xl">
                Elevate your NFT collection with ease!
            </h2>

            <span
                id="value"
                className="text-start text-lg sm:text-center sm:text-xl md:text-2xl lg:text-3xl"
            >
                <strong>Create</strong> captivating <strong>social</strong> <strong>media</strong>{' '}
                <strong>banners</strong>, <strong>desktop</strong> and <strong>mobile</strong>{' '}
                <strong>wallpapers</strong> from your <strong>favorite</strong>{' '}
                <strong>NFTs</strong> in <strong>seconds</strong>. Our <strong>user</strong>
                <strong>-</strong>
                <strong>friendly</strong> <strong>interface</strong> makes it simple to create{' '}
                <strong>professional</strong>
                <strong>-</strong>
                <strong>looking</strong> <strong>graphics</strong> without the need for editing
                skills. Join the digital art revolution and showcase your NFTs like never before.
                Start converting your collection today!
            </span>
        </div>
    </section>
);

const CollectionsSection = async () => {
    const collections = await queryCollectionsData({
        projection: { _id: 1, presentation: 1, chain: 1 }
    });

    return (
        <section className="flex w-full min-w-[226px] flex-col items-center justify-center gap-y-6 sm:gap-y-10">
            <h3 className="text-center text-2xl font-semibold leading-none sm:text-start sm:text-3xl">
                COLLECTIONS
            </h3>

            <Collections>
                <NFStudioList collections={collections} />
            </Collections>

            <Button className="w-full font-semibold 2xs:w-72" asChild>
                <Link href={PAGES.COLLECTIONS}>
                    SEE ALL COLLECTIONS <ArrowUpRight />
                </Link>
            </Button>
        </section>
    );
};

const ShowcaseSection = () => (
    <section className="relative flex h-[600px] w-full min-w-[226px] overflow-hidden rounded-lg bg-white/95 sm:h-56">
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-between pb-10 sm:items-start sm:p-5">
            <div className="flex min-w-full flex-col items-start bg-white/95 p-5 sm:bg-transparent sm:p-0">
                <span className="text-xl font-semibold text-primary-brand-blue 2xs:text-3xl md:text-4xl">
                    Want to create your own?
                </span>
                <span className="text-xl font-semibold text-primary-brand 2xs:text-3xl md:text-4xl">
                    Let's get started!
                </span>
            </div>

            <Button className="w-3/4 font-semibold sm:w-72" asChild>
                <Link href={PAGES.COLLECTIONS}>
                    START HERE <ArrowUpRight />
                </Link>
            </Button>
        </div>

        <ShowcaseSectionMiniGallery />
    </section>
);

const CLASS_PER_COLUMN_MINI_GALLERY = [
    'absolute -mt-20 flex w-1/4 flex-wrap sm:-mt-20',
    'absolute left-1/4 -mt-5 flex w-1/4 flex-wrap sm:-mt-10',
    'absolute left-2/4 -mt-12 flex w-1/4 flex-wrap 2xs:-mt-20 sm:-mt-36',
    'absolute left-3/4 mt-5 flex w-1/4 flex-wrap sm:-mt-80'
];

const constructMiniGalleryData = () => {
    const IMAGE_PER_COLUMN = 4;
    const miniGalleryData = [];

    for (let index = 0; index < MOBILE.length; index += IMAGE_PER_COLUMN) {
        const slice =
            index + IMAGE_PER_COLUMN > MOBILE.length ? [index] : [index, index + IMAGE_PER_COLUMN];

        miniGalleryData.push(MOBILE.slice(...slice));
    }

    return miniGalleryData;
};

const ShowcaseSectionMiniGallery = () => (
    <div className="absolute -right-48 top-28 z-0 w-[180%] rotate-20 2xs:-right-36 2xs:top-10 2xs:w-[120%] sm:-right-20 sm:-top-10 sm:w-2/3">
        {constructMiniGalleryData().map((columnData, index) => (
            <div key={index} className={CLASS_PER_COLUMN_MINI_GALLERY[index]}>
                {columnData.map(imgSrc => (
                    <div key={imgSrc} className="w-full p-1">
                        <Image
                            optimizedWidth={500}
                            alt="gallery"
                            className="rounded-lg"
                            src={getSrc(imgSrc)}
                            useCustomLoader={false}
                            width={337.16}
                            height={394.79}
                        />
                    </div>
                ))}
            </div>
        ))}
    </div>
);
