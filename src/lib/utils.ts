import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
};

type QueryStringProps = {
    [key: string]: string | number | number[] | boolean | undefined;
};

/**
 * Create a query string suitable for use in an URL search params.
 *
 * @param {QueryStringProps} data key-value pairs of data
 */
export const buildQueryString = (data: Readonly<QueryStringProps>) => {
    const query = new URLSearchParams();
    Object.entries(data).forEach(
        ([key, value]) => value !== undefined && query.set(key, value.toString())
    );

    return query.toString();
};
