/* IMPORTANT NOTICE! NO DATA CACHE IN FETCH - USED IN PAGES ROUTER */

import sharp from 'sharp';

type ImageOptimizationProps = {
    src: string;
    width?: number;
    quality?: number;
};

/**
 * Evaluates wether a resource is from NFStudio CMS store.
 * NFStudio CMS resources include only the ID part of the URL (relative).
 */
const isCMSStaticAsset = (url: string) => !url.startsWith('https://');

/**
 * Optimizes the image with CMS' own image optimization API to save computing resources.
 *
 * @param query - Nextjs request query search parameters
 * @param query.src - image source
 * @param query.width - image optimization width
 * @param query.quality - image optimization quality
 */
const optimizationWithCMSImageApi = async ({ src, width, quality }: ImageOptimizationProps) => {
    const imageData = await fetch(
        `${process.env.CONTENTFUL_ASSET_ENDPOINT}/${src}?fm=webp&w=${width}&q=${quality}`
    ).then(response => response.arrayBuffer());

    return Buffer.from(imageData);
};

/**
 * Performs image optimization for browser usage.
 *
 * @param query - Nextjs request query search parameters
 * @param query.src - image source
 * @param [query.width] - image optimization width
 * @param [query.quality] - image optimization quality
 */
export const optimize = async ({ src, width = 1000, quality = 75 }: ImageOptimizationProps) => {
    const decoded = decodeURI(src);

    if (isCMSStaticAsset(decoded)) {
        return optimizationWithCMSImageApi({ src: decoded, width, quality });
    }

    const imageData = await fetch(decoded).then(response => response.arrayBuffer());

    return sharp(new Uint8Array(imageData))
        .resize({
            withoutEnlargement: true,
            width
        })
        .webp({ quality })
        .toBuffer();
};
