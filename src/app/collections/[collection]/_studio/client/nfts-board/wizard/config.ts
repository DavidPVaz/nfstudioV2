import {
    PLATFORM_DISPLAY_NAME,
    PLATFORM_OPTIONS_MAP,
    OPTION_DISPLAY_NAME,
    type Platform,
    type Option
} from '@/enums';
// TODO: move all this to lib
export const getAvailablePlatforms = () =>
    Object.entries(PLATFORM_DISPLAY_NAME).map(([value, display]) => ({
        value,
        display
    })) as { value: Platform; display: string }[];

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

export const getPlatformOptionConfig = ({
    platform,
    option
}: {
    platform: Platform;
    option: Option;
}) => PLATFORM_OPTIONS_MAP[platform][option]!;
