import { buildQueryString } from '@/lib/utils';
import type { ImageLoaderProps, ImageLoader } from 'next/image';

type LoaderProps = Omit<ImageLoaderProps, 'width'> & {
    maxAge?: number | string | null;
    sMaxAge?: number | string | null;
    width?: number | string;
    quality?: number | string;
};

/**
 * Create a custom image loader to use in image optimization.
 *
 * @param data data to compose custom loader query
 * @param data.src image source
 * @param data.width intended image width
 * @param data.quality intended image quality
 * @param data.maxAge number of seconds of browser cache
 * @param data.sMaxAge number of seconds of server cache
 */
export const getLoader =
    ({ src, width, quality, maxAge, sMaxAge }: LoaderProps): ImageLoader =>
    () =>
        `/api/image-loader?${buildQueryString({
            src,
            width,
            quality,
            maxAge,
            sMaxAge
        })}`;
