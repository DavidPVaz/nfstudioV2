import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
};

type QueryStringProps = Record<
    string,
    | string
    | number
    | any[]
    | boolean
    | { [key: string]: string | number | null | undefined | boolean | any[] | {} }
    | undefined
    | null
>;

/**
 * Create a query string suitable for use in an URL search params that iterates 1 level deep in case of an object as value
 *
 * @param {QueryStringProps} data key-value pairs of query string data
 */
export const buildQueryString = (data: QueryStringProps) => {
    const query = new URLSearchParams();

    Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null) {
            return;
        }

        if (typeof value === 'object' && !Array.isArray(value)) {
            Object.entries(value).forEach(([deepKey, deepValue]) => {
                if (
                    deepValue === undefined ||
                    deepValue === null ||
                    (typeof deepValue === 'object' && !Array.isArray(deepValue))
                ) {
                    return;
                }

                query.set(
                    `${key}.${deepKey}`,
                    Array.isArray(deepValue)
                        ? deepValue
                              .filter(element => element !== null && element !== undefined)
                              .toString()
                        : deepValue.toString()
                );
            });

            return;
        }

        query.set(
            key,
            Array.isArray(value)
                ? value.filter(element => element !== null && element !== undefined).toString()
                : value.toString()
        );
    });

    return query.toString();
};
