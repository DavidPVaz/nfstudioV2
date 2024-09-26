import sharp from 'sharp';
import {
    getImageMetadata,
    resizeNft,
    createResizedLogo,
    getLogoPosition,
    createResizedNFStudioLayerLogo
} from '@/server/service/nft-converter/core';

export type CreateOptions = {
    src: string;
    width: number;
    height: number;
    atRight: boolean;
    coverStyle: boolean;
    mobile: boolean;
    logoSrc?: string;
    blur?: boolean;
    collection: string;
};

/**
 * Create the NFStudio wallpaper/banner image.
 *
 * @param options
 * @param options.src - the nft image src to create from
 * @param options.width - the banner/wallpaper width
 * @param options.height - the banner/wallpaper height
 * @param options.atRight - wether the nft image will be at the right in the new banner/wallpaper
 * @param options.coverStyle - wether the nft image will created with cover style option
 * @param options.mobile - wether selected platform was mobile
 * @param options.logoSrc - the logo image src
 * @param options.blur - wether to blur the created image
 * @param options.collection - the nft collection name
 */
export const create = async ({
    src,
    width,
    height,
    atRight,
    coverStyle,
    mobile,
    logoSrc,
    blur = false,
    collection
}: CreateOptions) => {
    const nftBuffer = await fetch(decodeURI(src)).then(response => response.arrayBuffer());
    let nft = sharp(new Uint8Array(nftBuffer));

    const { background } = await getImageMetadata(nft);

    nft = resizeNft({ nft, width, height, background, mobile, atRight, coverStyle, collection });

    if (blur) {
        nft = nft.blur(1);
    }

    if (logoSrc && !coverStyle) {
        const logoImage = await createResizedLogo({
            logoSrc,
            width,
            height,
            mobile,
            blur
        });

        const { height: logoHeight, width: logoWidth } = await getImageMetadata(sharp(logoImage));

        nft = nft.composite([
            {
                input: logoImage,
                blend: 'over',
                ...getLogoPosition({ width, height, logoWidth, logoHeight, mobile, atRight })
            }
        ]);
    }

    return nft;
};

/**
 * Create the ordered NFStudio banner/wallpaper image.
 *
 * @param options
 * @param options.src - the nft image src to create from
 * @param options.width - the banner/wallpaper width
 * @param options.height - the banner/wallpaper height
 * @param options.atRight - wether the nft image will be at the right in the new banner/wallpaper
 * @param options.coverStyle - wether the nft image will created with cover style option
 * @param options.mobile - wether selected platform was mobile
 * @param options.logoSrc - the logo image src
 * @param options.collection - the nft collection name
 * @param options.dpi - resolution dpi (dots per inch)
 */
export const order = async ({
    dpi,
    ...createOptions
}: Omit<CreateOptions, 'blur'> & { dpi: number }) =>
    (await create(createOptions)).withMetadata({ density: dpi }).png({ quality: 100 }).toBuffer();

/**
 * Create the preview image of a NFStudio banner/wallpaper.
 *
 * @param options
 * @param options.src - the nft image src to create from
 * @param options.width - the banner/wallpaper width
 * @param options.height - the banner/wallpaper height
 * @param options.atRight - wether the nft image will be at the right in the new banner/wallpaper
 * @param options.coverStyle - wether the nft image will created with cover style option
 * @param options.mobile - wether selected platform was mobile
 * @param options.logoSrc - the logo image src
 * @param options.collection - the nft collection name
 */
export const preview = async (createOptions: Omit<CreateOptions, 'blur'>) => {
    const nft = await create({
        blur: true,
        ...createOptions
    });

    const nfstudioLayer = await createResizedNFStudioLayerLogo(createOptions.width);

    return sharp(await nft.webp({ quality: 30 }).toBuffer())
        .composite([
            {
                input: nfstudioLayer,
                blend: 'over',
                gravity: 'centre'
            }
        ])
        .webp({ quality: 30 })
        .toBuffer();
};
