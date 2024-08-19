import sharp from 'sharp';

interface ImageOptimizationProps {
    src: string;
    width?: string;
    quality?: string;
    ttl?: string;
}

/**
 * Evaluates wether a resource is from NFStudio CMS store.
 * NFStudio CMS resources include only the ID part of the URL (relative).
 */
const isCMSStaticAsset = (url: string) => !url.startsWith('https://');

/**
 * Retrieve Nextjs data cache settings for optimized images.
 * If a time to live (ttl) is provided, it will be used to revalidate the data cache.
 * If not provided, we will cache indefinitely until on demand revalidation is performed for the provided tag
 *
 * @param {ImageOptimizationProps['ttl']} [ttl] - time to live in seconds
 * @param {string} tag - tag to be used as identifier to use on demand revalidation
 */
const getDataCacheSettings = ({ ttl, tag }: { ttl?: string; tag: string }): RequestInit => {
    if (ttl) {
        return { next: { revalidate: Number.parseInt(ttl, 10) } };
    }

    return { cache: 'force-cache', next: { tags: [tag] } };
};

/**
 * Performs image optimization for browser usage.
 *
 * @param {ImageOptimizationProps} query - Nextjs request query search parameters
 * @param {ImageOptimizationProps['src']} query.src - image source
 * @param {ImageOptimizationProps['width']} [query.width] - image optimization width
 * @param {ImageOptimizationProps['quality']} [query.quality] - image optimization quality
 * @param {ImageOptimizationProps['ttl']} [query.ttl] - time to live in seconds for data cache
 */
export const optimize = async ({
    src,
    width = '1000',
    quality = '75',
    ttl
}: ImageOptimizationProps) => {
    const decoded = decodeURI(src);
    const buffer = await fetch(
        isCMSStaticAsset(decoded) ? `${process.env.CONTENTFUL_ASSET_ENDPOINT}/${decoded}` : decoded,
        getDataCacheSettings({ ttl, tag: decoded })
    ).then(response => response.arrayBuffer());

    return sharp(new Uint8Array(buffer))
        .resize({
            withoutEnlargement: true,
            width: Number.parseInt(width, 10)
        })
        .webp({ quality: Number.parseInt(quality, 10) })
        .toBuffer();
};
