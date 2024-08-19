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
 * @param {LoaderProps['src']} data.src image src
 * @param {LoaderProps['width']} data.width intended image width
 * @param {LoaderProps['quality']} [data.quality] intended image quality
 * @param {LoaderProps['maxAge']} [data.maxAge] number of seconds of browser cache
 * @param {LoaderProps['sMaxAge']} [data.sMaxAge] number of seconds of server cache
 */
export default ({ src, width, quality, maxAge, sMaxAge }: LoaderProps): ImageLoader =>
    () =>
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/loader?${buildQueryString({
            src,
            width,
            quality,
            maxAge,
            sMaxAge
        })}`;
