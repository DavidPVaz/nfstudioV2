import React from 'react';
import type { ImageLoaderProps, ImageLoader } from 'next/image';
import { buildQueryString } from '@/lib/utils';
import { PLATFORMS } from '@/enums';
import { useModal } from '@/hooks/use-modal';
import { Modal } from '@/components/molecules/modal';
import { Button } from '@/components/atoms/button';
import { Image } from '@/components/atoms/image';
import { useStudioContext } from '@/app/collections/[collection]/_studio/client/context';
import { useWizardContext } from '@/app/collections/[collection]/_studio/client/nfts-board/wizard/wizard';
import { getPlatformOptionConfig } from '@/app/collections/[collection]/_studio/client/nfts-board/wizard/config';

type LoaderProps = ImageLoaderProps & {
    maxAge?: number | string;
    sMaxAge?: number | string;
    height: number;
    atRight: boolean;
    coverStyle: boolean;
    logoSrc?: string;
    mobile: boolean;
    collection: string;
};

/**
 * Create a custom preview image loader.
 *
 * @param maxAge number of seconds of browser cache
 * @param sMaxAge number of seconds of server cache
 * @param src the nft image source
 * @param width the selected platform width
 * @param height the selected platform height
 * @param atRight wether the nft position is at right
 * @param coverStyle wether the image to be created is in cover style
 * @param logoSrc selected logo image src
 * @param mobile wether selected platform is a mobile one
 * @param collection name of the collection
 */
const getPreviewLoader =
    ({
        maxAge,
        sMaxAge,
        src,
        width,
        height,
        atRight,
        coverStyle,
        logoSrc,
        mobile,
        collection
    }: LoaderProps): ImageLoader =>
    () =>
        `/api/preview?${buildQueryString({
            maxAge,
            sMaxAge,
            src,
            width,
            height,
            atRight,
            coverStyle,
            logoSrc,
            mobile,
            collection
        })}`;

const content = 'Preview';

export const Preview = React.memo(() => {
    const { selectedCollection, cacheStrategy } = useStudioContext();
    const {
        data: { selectedNFT, atRight, coverStyle, logo, platform, option }
    } = useWizardContext();
    const { isOpen, open, toggle } = useModal();

    const { width, height } = getPlatformOptionConfig({ platform: platform!, option: option! });
    const mobile = platform === PLATFORMS.MOBILE;
    // TODO: aspect ration. take height into account as well, it can be mobile but be flipped
    return (
        <>
            <Button onClick={open} className="h-10 px-5 2xs:h-11 2xs:px-8">
                PREVIEW
            </Button>

            <Modal
                extraContainer
                dialog
                open={isOpen}
                onOpenChange={toggle}
                title={content}
                description={content}
                className={`${mobile ? 'max-h-[95vh] min-h-[85vh]' : 'min-w-[95vw] max-w-[95vw]'} cursor-auto rounded-none border-0 bg-transparent px-6 py-16`}
            >
                <Image
                    variant={'contain'}
                    width={width}
                    height={height}
                    src={selectedNFT.src}
                    alt={`Preview creation of NFT #${selectedNFT.id}`}
                    customUsageLoader={getPreviewLoader({
                        src: encodeURI(selectedNFT.src),
                        width,
                        height,
                        atRight,
                        coverStyle,
                        logoSrc: coverStyle || !logo ? undefined : encodeURI(logo),
                        mobile,
                        collection: selectedCollection.toLowerCase(),
                        ...cacheStrategy
                    })}
                />
                <span className="absolute -bottom-3 w-full px-6 text-center text-sm">
                    Ordered image will not have any watermark and will have 100% quality.
                </span>
            </Modal>
        </>
    );
});
