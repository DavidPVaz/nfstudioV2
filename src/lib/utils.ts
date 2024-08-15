import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
};

export type QueryStringProps = Record<
    string,
    | string
    | number
    | any[]
    | boolean
    | { [key: string]: string | number | null | undefined | boolean | any[] }
    | undefined
    | null
>;

/**
 * Create a query string suitable for use in an URL search params that iterates 1 level deep in case of an object value
 *
 * @param {QueryStringProps} data key-value pairs of data
 */
export const buildQueryString = (data: Readonly<QueryStringProps>) => {
    const query = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null) {
            return;
        }

        if (typeof value === 'object' && !Array.isArray(value)) {
            Object.entries(value).forEach(([deepKey, deepValue]) => {
                if (deepValue === undefined || deepValue === null) {
                    return;
                }

                return query.set(`${key}.${deepKey}`, deepValue.toString());
            });

            return;
        }

        return query.set(key, value.toString());
    });

    return query.toString();
};
