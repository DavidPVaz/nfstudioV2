import sharp from 'sharp';
import { getCollectionCustomization } from '@/server/service/nft-converter/customization';
import type { CreateOptions } from '@/server/service/nft-converter';

/**
 * Retrieves an image metadata.
 *
 * @param image sharp image instance
 */
export const getImageMetadata = (image: sharp.Sharp) =>
    image.metadata().then(({ channels, width, height }) =>
        image
            .raw()
            .toBuffer()
            .then(data => {
                const offset = channels! * (width! * 1 + 1);

                return {
                    background: { r: data[offset], g: data[offset + 1], b: data[offset + 2] },
                    width: width!,
                    height: height!
                };
            })
    );

/**
 * Resize a sharp image.
 *
 * @param options
 * @param options.nft - the sharp image to resize
 * @param options.width - the new image width
 * @param options.height - the new image height
 * @param options.background - the image background rgb options from metadata
 * @param options.background.r - the image background red value
 * @param options.background.g - the image background green value
 * @param options.background.b - the image background blue value
 * @param options.mobile - wether the new image will be for a mobile format
 * @param options.atRight - wether the position of the image is at right
 * @param options.coverStyle - wether the image will be with cover style option
 * @param options.collection - the nft collection name
 */
export const resizeNft = ({
    nft,
    width,
    height,
    background,
    mobile,
    atRight,
    coverStyle,
    collection
}: Omit<CreateOptions, 'src' | 'logoSrc' | 'blur'> & {
    nft: sharp.Sharp;
    background: { r: number; g: number; b: number };
}) =>
    (getCollectionCustomization(collection)?.(nft) ?? nft).resize({
        width,
        height,
        fit: mobile && coverStyle ? sharp.fit.cover : sharp.fit.contain,
        position: mobile && coverStyle ? 'centre' : !mobile && atRight ? 'right bottom' : 'bottom',
        withoutEnlargement: false,
        background
    });

/**
 * Create a resized sharp logo image.
 *
 * @param options
 * @param options.logoSrc - the logo image src
 * @param options.width - the new image width where logo will be included
 * @param options.height - the new image height where logo will be included
 * @param options.mobile - wether the new image where logo will be included is in mobile format
 * @param options.blur - wether to blur the created image
 */

export const createResizedLogo = async ({
    logoSrc,
    width,
    height,
    mobile,
    blur
}: Omit<CreateOptions, 'src' | 'atRight' | 'coverStyle' | 'collection'>) => {
    const logoBuffer = await fetch(
        `${process.env.CONTENTFUL_ASSET_ENDPOINT}/${decodeURI(logoSrc!)}`
    ).then(response => response.arrayBuffer());

    const { height: logoHeight, width: logoWidth } = await getImageMetadata(
        sharp(new Uint8Array(logoBuffer))
    );

    const options = {} as { height?: number; width?: number };
    let logo = sharp(new Uint8Array(logoBuffer));

    if (!mobile && (logoHeight * 100) / height > 35) {
        // not mobile and actual height of the logo is bigger than 35% of the created image height
        options.height = Math.floor(height * 0.35);

        if ((options.height * (logoWidth / logoHeight) * 100) / width > 25) {
            // the new logo width taking into account the new height is bigger than 25%
            delete options.height;
            options.width = Math.floor(width * 0.25);
        }
    } else if (!mobile && (logoWidth * 100) / width > 25) {
        // not mobile and actual width of the logo is bigger than 25% of the created image width
        options.width = Math.floor(width * 0.25);
    } else if ((logoHeight * 100) / height > 20) {
        // actual height of the logo is bigger than 20% of the created image height
        options.height = Math.floor(height * 0.2);

        if ((options.height * (logoWidth / logoHeight) * 100) / width > 45) {
            // the new logo width having into account the new height is bigger than 45%
            delete options.height;
            options.width = Math.floor(width * 0.45);
        }
    } else {
        // new logo width will be:
        // on mobile - 45% of the created image width
        // not on mobile - 25% of the created image width
        options.width = Math.floor(width * (mobile ? 0.45 : 0.25));
    }

    logo = logo.resize({
        fit: sharp.fit.contain,
        position: 'center',
        ...options
    });

    if (blur) {
        logo = logo.blur(1);
    }

    return logo.toBuffer();
};

/**
 * Get the logo position coordinates in the new image.
 *
 * @param options
 * @param options.width - the new image width where logo will be included
 * @param options.height - the new image height where logo will be included
 * @param options.logoWidth - the logo image width
 * @param options.logoHeight - the logo image height
 * @param options.mobile - wether the new image where logo will be included is in mobile format
 * @param options.atRight - wether the new image where logo will be included is at right
 */

export const getLogoPosition = ({
    width,
    height,
    logoWidth,
    logoHeight,
    mobile,
    atRight
}: Omit<CreateOptions, 'src' | 'coverStyle' | 'logoSrc' | 'blur' | 'collection'> & {
    logoWidth: number;
    logoHeight: number;
}) => {
    if (mobile) {
        // top is 5% of total height and left is centered
        return { top: Math.floor(height * 0.05), left: Math.floor(width / 2 - logoWidth / 2) };
    }

    // if nft is at right, top is centered and left is 10% of total width
    // if not on right, top and left is 2% of total height
    return atRight
        ? { top: Math.floor(height / 2 - logoHeight / 2), left: Math.floor(width * 0.1) }
        : { top: Math.floor(height * 0.02), left: width - logoWidth - Math.floor(height * 0.02) };
};

/**
 * Create a resized NFStudio layer logo image.
 *
 * @param width - the new image width where NFStudio logo will be included
 */
export const createResizedNFStudioLayerLogo = async (width: number) => {
    const logoBuffer = await fetch(
        `${process.env.CONTENTFUL_ASSET_ENDPOINT}/1WHDZHPuu905hw4EadDRZI/40eaf60a7caf7bff7c13d8014391d89a/watermark.png`
    ).then(response => response.arrayBuffer());

    return sharp(new Uint8Array(logoBuffer))
        .resize({
            fit: sharp.fit.contain,
            position: 'center',
            width: Math.floor(width * 0.75)
        })
        .trim()
        .toBuffer();
};
