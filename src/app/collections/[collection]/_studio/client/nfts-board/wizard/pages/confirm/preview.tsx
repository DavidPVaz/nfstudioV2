import React, { useCallback } from 'react';
import type { ImageLoaderProps, ImageLoader } from 'next/image';
import { buildQueryString, getPlatformOptionConfig } from '@/lib/utils';
import { PLATFORMS } from '@/enums';
import { useModal } from '@/hooks/use-modal';
import { useNotification } from '@/hooks/use-notification';
import { useNetworkState } from '@/hooks/use-network-state';
import { Modal } from '@/components/molecules/modal';
import { Button } from '@/components/atoms/button';
import { Image } from '@/components/atoms/image';
import { useCollectionContext } from '@/app/collections/[collection]/context';
import { useWizardContext } from '@/app/collections/[collection]/_studio/client/nfts-board/wizard/wizard';

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
    const { selectedCollection, cacheStrategy } = useCollectionContext();
    const {
        data: { selectedNFT, atRight, coverStyle, logo, platform, option }
    } = useWizardContext();
    const { isOpen, open, toggle } = useModal();
    const { notify } = useNotification();
    const { isOnline } = useNetworkState();

    const { width, height } = getPlatformOptionConfig({ platform: platform!, option: option! });
    const mobile = platform === PLATFORMS.MOBILE;

    const onPreview = useCallback(() => {
        if (!isOnline) {
            notify({
                title: 'You are offline.',
                description: 'Please retry previewing when you come back online.',
                variant: 'offline'
            });
            return;
        }

        open();
    }, [open, isOnline, notify]);

    return (
        <>
            <Button onClick={onPreview} className="h-10 px-5 2xs:h-11 2xs:px-8">
                PREVIEW
            </Button>
            <Modal
                extraContainer
                dialog
                open={isOpen}
                onOpenChange={toggle}
                title={content}
                description={content}
                className={`${mobile ? 'max-h-[95vh] min-h-[95vh] 3xl:max-h-[85vh] 3xl:min-h-[85vh]' : 'max-w-[95vw] 3xl:max-w-[85vw]'} cursor-auto rounded-none border-0 bg-transparent px-6 py-16`}
            >
                <Image
                    variant={mobile ? 'fill_contain_h' : 'fill_contain_w'}
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
                        collection: selectedCollection,
                        ...cacheStrategy
                    })}
                />

                <span className="absolute bottom-3 w-full px-6 text-center text-sm">
                    Ordered image will not have any watermark and will have 100% quality.
                </span>
            </Modal>
        </>
    );
});
