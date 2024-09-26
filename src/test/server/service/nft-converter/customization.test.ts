import { describe, expect, vi, afterEach, it } from 'vitest';
import type { Sharp } from 'sharp';
import {
    COLLECTIONS,
    getCollectionCustomization
} from '@/server/service/nft-converter/customization';

describe('server/service/nft-converter/customization', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should get the customization functions', () => {
        // exercise && verify
        Object.values(COLLECTIONS).forEach(collection => {
            expect(getCollectionCustomization(collection)).toBeTypeOf('function');
        });
    });

    it('should return undefined if there is not a customization function for a collection', () => {
        // exercise && verify
        expect(getCollectionCustomization('invalid')).toBeUndefined();
    });

    it('should customize froganas image', () => {
        // setup
        const extractMock = vi.fn().mockImplementation(() => 'result');
        const nft = { extract: extractMock } as unknown as Sharp;

        // exercise
        const result = getCollectionCustomization(COLLECTIONS.FROGANAS)(nft);

        // verify
        expect(result).toEqual('result');
        expect(extractMock).toHaveBeenNthCalledWith(1, {
            left: 0,
            top: 0,
            width: 2925,
            height: 3000
        });
    });
});
