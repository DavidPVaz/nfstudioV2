import { describe, expect, vi, afterEach, it } from 'vitest';
import { cn, buildQueryString } from '@/lib/utils';

const { clsxMock, twMergeMock } = vi.hoisted(() => ({
    clsxMock: vi.fn(),
    twMergeMock: vi.fn()
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
});
