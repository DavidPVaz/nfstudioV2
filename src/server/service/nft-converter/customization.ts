/**
 * Collections customizations
 */
import sharp from 'sharp';

/**
 * Collections with customization on banner/wallpaper generation.
 */
export const COLLECTIONS = {
    FROGANAS: 'Froganas'
} as const;

/**
 * Froganas customization.
 * It crops the NFT 3000x3000 image width 50px on the right side.
 *
 * @param nft - the sharp image
 */
const froganasCropRightSide = (nft: sharp.Sharp) =>
    nft.extract({ left: 0, top: 0, width: 2925, height: 3000 });

/**
 * Maps nft collections to its customizations.
 */
const COLLECTION_CUSTOMIZATION = {
    [COLLECTIONS.FROGANAS]: froganasCropRightSide
};

/**
 * Retrieves a nft collection banner/wallpaper generation customization.
 *
 * @param collection - the nft collection name
 */
export const getCollectionCustomization = (
    collection: string
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
): ((nft: sharp.Sharp) => sharp.Sharp | undefined) => COLLECTION_CUSTOMIZATION[collection];
