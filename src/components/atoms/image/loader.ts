import { buildQueryString } from '@/lib/utils';
import type { ImageLoaderProps, ImageLoader } from 'next/image';

interface LoaderProps extends ImageLoaderProps {
    maxAge?: number | string;
    sMaxAge?: number | string;
}

/**
 * Create a custom image loader to use in image optimization.
 *
 * @param {LoaderProps} data data to compose custom loader query
 * @param {LoaderProps['src']} data.src image source
 * @param {LoaderProps['width']} data.width intended image width
 * @param {LoaderProps['quality']} [data.quality] intended image quality
 * @param {LoaderProps['maxAge']} [data.maxAge] number of seconds of browser cache
 * @param {LoaderProps['sMaxAge']} [data.sMaxAge] number of seconds of server cache
 */
export const getLoader =
    ({ src, width, quality, maxAge, sMaxAge }: LoaderProps): ImageLoader =>
    () =>
        `https://nfstudio.xyz/api/loader?${buildQueryString({
            url: src,
            w: width,
            q: quality,
            maxAge,
            sMaxAge
        })}`;
