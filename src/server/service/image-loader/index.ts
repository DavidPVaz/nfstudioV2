import sharp from 'sharp';

interface ImageOptimizationProps {
    url: string;
    width?: string;
    quality?: string;
}

/**
 * Evaluates wether a resource is from NFStudio CMS store.
 * NFStudio CMS resources include only the ID part of the URL (relative).
 */
const isCMSStaticAsset = (url: string) => !url.startsWith('https://');

/**
 * Performs image optimization for browser usage.
 *
 * @param {ImageOptimizationProps} query - Nextjs request query search parameters
 * @param {ImageOptimizationProps['url']} query.url - image source url
 * @param {ImageOptimizationProps['width']} [query.width] - image optimization width
 * @param {ImageOptimizationProps['quality']} [query.quality] - image optimization quality
 */
export const optimize = async ({ url, width = '1000', quality = '75' }: ImageOptimizationProps) => {
    const decoded = decodeURI(url);
    const buffer = await fetch(
        isCMSStaticAsset(decoded) ? `${process.env.CONTENTFUL_ASSET_ENDPOINT}/${decoded}` : decoded
    ).then(response => response.arrayBuffer());

    return sharp(new Uint8Array(buffer))
        .resize({
            withoutEnlargement: true,
            width: Number.parseInt(width, 10)
        })
        .webp({ quality: Number.parseInt(quality, 10) })
        .toBuffer();
};
