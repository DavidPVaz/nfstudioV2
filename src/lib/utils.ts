import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
    PLATFORM_OPTIONS_MAP,
    PLATFORM_DISPLAY_NAME,
    OPTION_DISPLAY_NAME,
    type Platform,
    type Option
} from '@/enums';

/**
 * Merge tailwind utility classNames.
 *
 * @param inputs tailwind classNames
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

type QueryStringProps = Record<
    string,
    | string
    | number
    | unknown[]
    | boolean
    | Record<string, string | number | null | undefined | boolean | unknown[] | object>
    | undefined
    | null
>;

/**
 * Create a query string suitable for use in an URL search params that iterates 1 level deep in case of an object as value
 *
 * @param data key-value pairs of query string data
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

/**
 * Checks wether the device is Mac OS through UA.
 */
export const isMacOS = (userAgent: string) => userAgent.includes('Mac OS');

/**
 * Gets the minimum and max of all the available creation configuration options in NFStudio.
 */
export const getOptionsMinMaxConfig = () =>
    Object.values(PLATFORM_OPTIONS_MAP).reduce(
        (acc, option) => {
            Object.values(option).forEach(config => {
                acc.width.min = Math.min(acc.width.min, config.width);
                acc.width.max = Math.max(acc.width.max, config.width);
                acc.height.min = Math.min(acc.height.min, config.height);
                acc.height.max = Math.max(acc.height.max, config.height);
                acc.dpi.min = Math.min(acc.dpi.min, config.dpi);
                acc.dpi.max = Math.max(acc.dpi.max, config.dpi);
            });

            return acc;
        },
        {
            dpi: {
                min: Infinity,
                max: -Infinity
            },
            width: {
                min: Infinity,
                max: -Infinity
            },
            height: {
                min: Infinity,
                max: -Infinity
            }
        }
    );

/**
 * Gets NFStudio available platforms with its display name.
 */
export const getAvailablePlatforms = () =>
    Object.entries(PLATFORM_DISPLAY_NAME).map(([value, display]) => ({
        value,
        display
    })) as { value: Platform; display: string }[];

/**
 * Gets NFStudio available options for a specific platform with its display name.
 */
export const getPlatformAvailableOptions = (platform: Platform) =>
    Object.entries(PLATFORM_OPTIONS_MAP[platform]).reduce(
        (acc, [option, config]) => {
            const { width, height } = config;

            return [
                ...acc,
                {
                    value: option as Option,
                    display: `${OPTION_DISPLAY_NAME[option as Option]} - ${width}px x ${height}px`
                }
            ];
        },
        [] as { value: Option; display: string }[]
    );

/**
 * Gets NFStudio configuration for a specific option.
 */
export const getPlatformOptionConfig = ({
    platform,
    option
}: {
    platform: Platform;
    option: Option;
}) => PLATFORM_OPTIONS_MAP[platform][option]!;
