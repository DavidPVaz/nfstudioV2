import { PLATFORMS, OPTIONS, type Platform, type Option } from '@/enums';

export const PLATFORM_DISPLAY_NAME: Record<Platform, string> = {
    [PLATFORMS.SOCIAL_MEDIA]: 'Social',
    [PLATFORMS.DESKTOP]: 'Desktop',
    [PLATFORMS.MOBILE]: 'Mobile'
};

export const OPTION_DISPLAY_NAME: Record<Option, string> = {
    [OPTIONS.TWITTER_BANNER]: 'Twitter banner',
    [OPTIONS.FACEBOOK_BANNER]: 'Facebook banner',
    [OPTIONS.YOUTUBE_BANNER]: 'Youtube banner',
    [OPTIONS.DESKTOP_HD]: 'HD',
    [OPTIONS.DESKTOP_FULL_HD]: 'Full HD',
    [OPTIONS.DESKTOP_2K]: '2K',
    [OPTIONS.DESKTOP_4K]: '4K',
    [OPTIONS.IPHONE_4]: 'iPhone 4',
    [OPTIONS.IPHONE_5]: 'iPhone 5',
    [OPTIONS.SAMSUNG_A5]: 'Samsung A5',
    [OPTIONS.IPHONE_678]: 'iPhone 6 7 8',
    [OPTIONS.SAMSUNG_S5]: 'Samsung S5',
    [OPTIONS.IPHONE_678PLUS]: 'iPhone 6+ 7+ 8+',
    [OPTIONS.IPHONE_X]: 'iPhone X',
    [OPTIONS.SAMSUNG_S6]: 'Samsung S6',
    [OPTIONS.SAMSUNG_S8PLUS]: 'Samsung S8+'
};

type OptionConfig = {
    width: number;
    height: number;
    dpi: number;
};
type PlatformOptions = Partial<Record<Option, OptionConfig>>;

export const PLATFORM_OPTIONS_MAP: Record<Platform, PlatformOptions> = {
    [PLATFORMS.SOCIAL_MEDIA]: {
        [OPTIONS.TWITTER_BANNER]: {
            width: 1500,
            height: 500,
            dpi: 72
        },
        [OPTIONS.FACEBOOK_BANNER]: {
            width: 1640,
            height: 664,
            dpi: 72
        },
        [OPTIONS.YOUTUBE_BANNER]: {
            width: 2560,
            height: 1440,
            dpi: 72
        }
    },
    [PLATFORMS.DESKTOP]: {
        [OPTIONS.DESKTOP_HD]: {
            width: 1280,
            height: 720,
            dpi: 72
        },
        [OPTIONS.DESKTOP_FULL_HD]: {
            width: 1920,
            height: 1080,
            dpi: 72
        },
        [OPTIONS.DESKTOP_2K]: {
            width: 2048,
            height: 1080,
            dpi: 72
        },
        [OPTIONS.DESKTOP_4K]: {
            width: 4096,
            height: 2160,
            dpi: 72
        }
    },
    [PLATFORMS.MOBILE]: {
        [OPTIONS.IPHONE_4]: {
            width: 640,
            height: 900,
            dpi: 326
        },
        [OPTIONS.IPHONE_5]: {
            width: 640,
            height: 1136,
            dpi: 326
        },
        [OPTIONS.SAMSUNG_A5]: {
            width: 720,
            height: 1280,
            dpi: 72
        },
        [OPTIONS.IPHONE_678]: {
            width: 750,
            height: 1334,
            dpi: 326
        },
        [OPTIONS.SAMSUNG_S5]: {
            width: 1080,
            height: 1920,
            dpi: 72
        },
        [OPTIONS.IPHONE_678PLUS]: {
            width: 1080,
            height: 1920,
            dpi: 401
        },
        [OPTIONS.IPHONE_X]: {
            width: 1125,
            height: 2436,
            dpi: 458
        },
        [OPTIONS.SAMSUNG_S6]: {
            width: 1440,
            height: 2560,
            dpi: 72
        },
        [OPTIONS.SAMSUNG_S8PLUS]: {
            width: 1440,
            height: 2560,
            dpi: 72
        }
    }
};

export const getAvailablePlatforms = () => PLATFORM_DISPLAY_NAME;
export const getAvailableOptions = () => OPTION_DISPLAY_NAME;
export const getPlatformAvailableOptions = (platform: Platform) =>
    Object.entries(PLATFORM_OPTIONS_MAP[platform]).reduce(
        (acc, [option, config]) => {
            const { width, height } = config;

            return {
                ...acc,
                [option as Option]: {
                    width,
                    height,
                    displayName: OPTION_DISPLAY_NAME[option as Option]
                }
            };
        },
        {} as Record<Option, { width: number; height: number; displayName: string }>
    );
export const getPlatformOptionConfig = ({
    platform,
    option
}: {
    platform: Platform;
    option: Option;
}) => PLATFORM_OPTIONS_MAP[platform][option]!;
