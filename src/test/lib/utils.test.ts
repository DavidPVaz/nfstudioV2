import { describe, expect, vi, afterEach, it } from 'vitest';
import { PLATFORM_DISPLAY_NAME, OPTION_DISPLAY_NAME, PLATFORMS, type Platform } from '@/enums';
import {
    cn,
    buildQueryString,
    isMacOS,
    getOptionsMinMaxConfig,
    getAvailablePlatforms,
    getPlatformAvailableOptions,
    getPlatformOptionConfig
} from '@/lib/utils';

const { clsxMock, twMergeMock, windowMock } = vi.hoisted(() => ({
    clsxMock: vi.fn(),
    twMergeMock: vi.fn(),
    windowMock: vi.fn()
}));

vi.mock('window', () => ({
    window: windowMock
}));

vi.mock('tailwind-merge', () => ({
    twMerge: twMergeMock
}));

vi.mock('clsx', async importOriginal => {
    const actual: object = await importOriginal();
    return {
        ...actual,
        clsx: clsxMock
    };
});

describe('lib/utils', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should use all className inputs and merge them', () => {
        // setup
        const className1 = 'some class';
        const className2 = 'some other class';
        const expectedClsxArgument = [className1, className2];
        const expectedTwMergeArgument = 'classNames';
        const expectedResult = 'merged';
        clsxMock.mockImplementationOnce(() => expectedTwMergeArgument);
        twMergeMock.mockImplementationOnce(() => expectedResult);

        // exercise
        const result = cn(className1, className2);

        // verify
        expect(result).toEqual(expectedResult);
        expect(clsxMock).toHaveBeenNthCalledWith(1, expectedClsxArgument);
        expect(twMergeMock).toHaveBeenNthCalledWith(1, expectedTwMergeArgument);
    });

    it('should build a query string and remove invalid values while constructing it one level deep if a value is an object', () => {
        // setup
        const queryArgs = {
            potato: null,
            egg: undefined,
            apple: 'red',
            size: 2,
            include: 0,
            glass: false,
            extra: ['banana', 2, 0, true, undefined],
            basket: {
                pear: null,
                grapes: undefined,
                juice: 'lemon',
                sugar: 0,
                water: true,
                components: ['wood', 'thread', null],
                unnecessary: {}
            }
        };
        const expectedQueryString =
            'apple=red&size=2&include=0&glass=false&extra=banana%2C2%2C0%2Ctrue&basket.juice=lemon&basket.sugar=0&basket.water=true&basket.components=wood%2Cthread';

        // exercise && verify
        expect(buildQueryString(queryArgs)).toEqual(expectedQueryString);
    });

    it('should check if user agent contains Mac OS', () => {
        // exercise && verify
        expect(isMacOS('it is not mac os')).toEqual(false);
        expect(isMacOS('it is Mac OS')).toEqual(true);
    });

    it('should get the correct values for min/max with and height', () => {
        // setup
        const expectedMinimumWidth = 640;
        const expectedMaximumWidth = 4096;
        const expectedMinimumHeight = 500;
        const expectedMaximumHeight = 2560;
        const expectedMinimumDpi = 72;
        const expectedMaximumDpi = 458;

        // exercise && verify
        expect(getOptionsMinMaxConfig()).toEqual({
            dpi: { min: expectedMinimumDpi, max: expectedMaximumDpi },
            width: { min: expectedMinimumWidth, max: expectedMaximumWidth },
            height: { min: expectedMinimumHeight, max: expectedMaximumHeight }
        });
    });

    it('should get the correct platform values and their display names', () => {
        // exercise && verify
        getAvailablePlatforms().forEach(({ value, display }) => {
            expect(PLATFORM_DISPLAY_NAME[value]).toEqual(display);
        });
    });

    it('should get the correct options values and their display names', () => {
        // exercise && verify
        (Object.values(PLATFORMS) as Platform[]).forEach(platform => {
            const availableOptions = getPlatformAvailableOptions(platform);

            availableOptions.forEach(({ value, display }) => {
                const { width, height } = getPlatformOptionConfig({ platform, option: value });

                expect(display).toEqual(`${OPTION_DISPLAY_NAME[value]} - ${width}px x ${height}px`);
            });
        });
    });
});
