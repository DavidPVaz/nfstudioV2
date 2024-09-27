/* eslint-disable @typescript-eslint/no-unsafe-return */
import { describe, expect, vi, afterEach, it } from 'vitest';
import { order, preview } from '@/server/service/nft-converter';

const {
    sharp,
    fetchMock,
    getImageMetadataMock,
    resizeNftMock,
    createResizedLogoMock,
    getLogoPositionMock,
    constructorMock,
    compositeMock,
    withMetadataMock,
    pngMock,
    webpMock,
    blurMock,
    toBufferMock,
    createResizedNFStudioLayerLogoMock
} = vi.hoisted(() => {
    const sharp = {
        composite: function (arg) {
            compositeMock(arg);
            return this;
        },
        png: function (arg) {
            pngMock(arg);
            return this;
        },
        webp: function (arg) {
            webpMock(arg);
            return this;
        },
        blur: function (arg) {
            blurMock(arg);
            return this;
        },
        withMetadata: function (arg) {
            withMetadataMock(arg);
            return this;
        },
        toBuffer: function () {
            return toBufferMock();
        }
    };

    return {
        sharp,
        fetchMock: vi.fn(),
        getImageMetadataMock: vi.fn(),
        resizeNftMock: vi.fn(),
        createResizedLogoMock: vi.fn(),
        getLogoPositionMock: vi.fn(),
        constructorMock: vi.fn(),
        compositeMock: vi.fn(),
        withMetadataMock: vi.fn(),
        pngMock: vi.fn(),
        webpMock: vi.fn(),
        blurMock: vi.fn(),
        toBufferMock: vi.fn(),
        createResizedNFStudioLayerLogoMock: vi.fn()
    };
});

vi.mock('@/server/service/nft-converter/core', () => ({
    getImageMetadata: getImageMetadataMock,
    resizeNft: resizeNftMock,
    createResizedLogo: createResizedLogoMock,
    getLogoPosition: getLogoPositionMock,
    createResizedNFStudioLayerLogo: createResizedNFStudioLayerLogoMock
}));

vi.mock('sharp', () => ({
    default: arg => {
        constructorMock(arg);
        return sharp;
    }
}));

describe('server/service/nft-converter/index', () => {
    global.fetch = fetchMock;

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should order a NFStudio banner/wallpaper without logo', async () => {
        // setup
        const src = 'image-src';
        const width = 1500;
        const height = 500;
        const dpi = 72;
        const atRight = true;
        const coverStyle = false;
        const mobile = false;
        const collection = 'name';

        const imageMetadata = { background: { r: 1, g: 2, b: 3 } };
        const sourceImageBuffer = Buffer.from(src);
        const expectedResult = Buffer.from('created-image');
        fetchMock.mockImplementationOnce(() =>
            Promise.resolve({ arrayBuffer: () => Promise.resolve(sourceImageBuffer) })
        );
        getImageMetadataMock.mockImplementationOnce(() => Promise.resolve(imageMetadata));
        resizeNftMock.mockImplementationOnce(() => sharp);
        toBufferMock.mockImplementationOnce(() => Promise.resolve(expectedResult));

        // exercise
        const result = await order({
            src,
            width,
            dpi,
            height,
            atRight,
            coverStyle,
            mobile,
            collection
        });

        // verify
        expect(result).toEqual(expectedResult);
        expect(withMetadataMock).toHaveBeenNthCalledWith(1, { density: dpi });
        expect(pngMock).toHaveBeenNthCalledWith(1, { quality: 100 });
        expect(toBufferMock).toHaveBeenNthCalledWith(1);
    });

    it('should order a NFStudio banner/wallpaper with logo', async () => {
        // setup
        const src = 'image-src';
        const width = 1440;
        const height = 2300;
        const dpi = 72;
        const atRight = false;
        const coverStyle = false;
        const logoSrc = 'logo-image-src';
        const mobile = true;
        const collection = 'name';

        const imageMetadata = { background: { r: 1, g: 2, b: 3 } };
        const logoMetadata = { height: 100, width: 400 };
        const sourceImageBuffer = Buffer.from(src);
        const resizedLogoImage = Buffer.from(logoSrc);
        const logoPosition = { top: 2, left: 2 };
        const expectedResult = Buffer.from('created-image');
        fetchMock.mockImplementationOnce(() =>
            Promise.resolve({ arrayBuffer: () => Promise.resolve(sourceImageBuffer) })
        );
        getImageMetadataMock.mockImplementationOnce(() => Promise.resolve(imageMetadata));
        resizeNftMock.mockImplementationOnce(() => sharp);
        createResizedLogoMock.mockImplementationOnce(() => Promise.resolve(resizedLogoImage));
        getImageMetadataMock.mockImplementationOnce(() => Promise.resolve(logoMetadata));
        getLogoPositionMock.mockImplementation(() => logoPosition);
        compositeMock.mockImplementationOnce(() => sharp);
        toBufferMock.mockImplementationOnce(() => Promise.resolve(expectedResult));

        // exercise
        const result = await order({
            src,
            width,
            dpi,
            height,
            atRight,
            coverStyle,
            mobile,
            logoSrc,
            collection
        });

        // verify
        expect(result).toEqual(expectedResult);
        expect(withMetadataMock).toHaveBeenNthCalledWith(1, { density: dpi });
        expect(pngMock).toHaveBeenNthCalledWith(1, { quality: 100 });
        expect(toBufferMock).toHaveBeenNthCalledWith(1);
    });

    it('should order a NFStudio mobile wallpaper with coverStyle', async () => {
        // setup
        const src = 'image-src';
        const width = 1440;
        const height = 2300;
        const dpi = 72;
        const atRight = false;
        const coverStyle = true;
        const mobile = true;
        const collection = 'name';

        const imageMetadata = { background: { r: 1, g: 2, b: 3 } };
        const sourceImageBuffer = Buffer.from(src);
        const expectedResult = Buffer.from('created-image');
        fetchMock.mockImplementationOnce(() =>
            Promise.resolve({ arrayBuffer: () => Promise.resolve(sourceImageBuffer) })
        );
        getImageMetadataMock.mockImplementationOnce(() => Promise.resolve(imageMetadata));
        resizeNftMock.mockImplementationOnce(() => sharp);
        toBufferMock.mockImplementationOnce(() => Promise.resolve(expectedResult));

        // exercise
        const result = await order({
            src,
            width,
            height,
            dpi,
            atRight,
            coverStyle,
            mobile,
            collection
        });

        // verify
        expect(result).toEqual(expectedResult);
        expect(withMetadataMock).toHaveBeenNthCalledWith(1, { density: dpi });
        expect(pngMock).toHaveBeenNthCalledWith(1, { quality: 100 });
        expect(toBufferMock).toHaveBeenNthCalledWith(1);
    });

    it('should preview a NFStudio banner/wallpaper without logo', async () => {
        // setup
        const src = 'image-src';
        const width = 1500;
        const height = 500;
        const atRight = true;
        const coverStyle = false;
        const mobile = false;
        const collection = 'name';

        const imageMetadata = { background: { r: 1, g: 2, b: 3 } };
        const sourceImageBuffer = Buffer.from(src);
        const nfstudioLayer = Buffer.from('layer');
        const firstImage = Buffer.from('nft-created');
        const expectedResult = Buffer.from('created-image');
        fetchMock.mockImplementationOnce(() =>
            Promise.resolve({ arrayBuffer: () => Promise.resolve(sourceImageBuffer) })
        );
        getImageMetadataMock.mockImplementationOnce(() => Promise.resolve(imageMetadata));
        resizeNftMock.mockImplementationOnce(() => sharp);
        createResizedNFStudioLayerLogoMock.mockImplementationOnce(() =>
            Promise.resolve(nfstudioLayer)
        );
        toBufferMock.mockImplementationOnce(() => Promise.resolve(firstImage));
        toBufferMock.mockImplementationOnce(() => Promise.resolve(expectedResult));

        // exercise
        const result = await preview({
            src,
            width,
            height,
            atRight,
            coverStyle,
            mobile,
            collection
        });

        // verify
        expect(result).toEqual(expectedResult);
        expect(createResizedNFStudioLayerLogoMock).toHaveBeenNthCalledWith(1, width);
        expect(constructorMock).toHaveBeenNthCalledWith(2, firstImage);
        expect(compositeMock).toHaveBeenNthCalledWith(1, [
            {
                input: nfstudioLayer,
                blend: 'over',
                gravity: 'centre'
            }
        ]);
        expect(webpMock).toHaveBeenNthCalledWith(2, { quality: 30 });
        expect(toBufferMock).toHaveBeenNthCalledWith(2);
        expect(blurMock).toHaveBeenNthCalledWith(1, 1);
    });

    it('should preview a NFStudio banner/wallpaper with logo', async () => {
        // setup
        const src = 'image-src';
        const width = 1440;
        const height = 2300;
        const atRight = false;
        const coverStyle = false;
        const logoSrc = 'logo-image-src';
        const mobile = true;
        const collection = 'name';

        const imageMetadata = { background: { r: 1, g: 2, b: 3 } };
        const logoMetadata = { height: 100, width: 400 };
        const sourceImageBuffer = Buffer.from(src);
        const nfstudioLayer = Buffer.from('layer');
        const firstImage = Buffer.from('nft-created');
        const resizedLogoImage = Buffer.from(logoSrc);
        const logoPosition = { top: 2, left: 2 };
        const expectedResult = Buffer.from('created-image');
        fetchMock.mockImplementationOnce(() =>
            Promise.resolve({ arrayBuffer: () => Promise.resolve(sourceImageBuffer) })
        );
        getImageMetadataMock.mockImplementationOnce(() => Promise.resolve(imageMetadata));
        resizeNftMock.mockImplementationOnce(() => sharp);
        createResizedLogoMock.mockImplementationOnce(() => Promise.resolve(resizedLogoImage));
        getImageMetadataMock.mockImplementationOnce(() => Promise.resolve(logoMetadata));
        getLogoPositionMock.mockImplementation(() => logoPosition);
        compositeMock.mockImplementation(() => sharp);
        createResizedNFStudioLayerLogoMock.mockImplementationOnce(() =>
            Promise.resolve(nfstudioLayer)
        );
        toBufferMock.mockImplementationOnce(() => Promise.resolve(firstImage));
        toBufferMock.mockImplementationOnce(() => Promise.resolve(expectedResult));

        // exercise
        const result = await preview({
            src,
            width,
            height,
            atRight,
            coverStyle,
            mobile,
            logoSrc,
            collection
        });

        // verify
        expect(result).toEqual(expectedResult);
        expect(createResizedNFStudioLayerLogoMock).toHaveBeenNthCalledWith(1, width);
        expect(constructorMock).toHaveBeenNthCalledWith(3, firstImage);
        expect(compositeMock).toHaveBeenNthCalledWith(2, [
            {
                input: nfstudioLayer,
                blend: 'over',
                gravity: 'centre'
            }
        ]);
        expect(webpMock).toHaveBeenNthCalledWith(2, { quality: 30 });
        expect(toBufferMock).toHaveBeenNthCalledWith(2);
        expect(blurMock).toHaveBeenNthCalledWith(1, 1);
    });

    it('should preview a NFStudio mobile wallpaper with coverStyle', async () => {
        // setup
        const src = 'image-src';
        const width = 1440;
        const height = 2300;
        const atRight = false;
        const coverStyle = true;
        const mobile = true;
        const collection = 'name';

        const imageMetadata = { background: { r: 1, g: 2, b: 3 } };
        const sourceImageBuffer = Buffer.from(src);
        const nfstudioLayer = Buffer.from('layer');
        const firstImage = Buffer.from('nft-created');
        const expectedResult = Buffer.from('created-image');
        fetchMock.mockImplementationOnce(() =>
            Promise.resolve({ arrayBuffer: () => Promise.resolve(sourceImageBuffer) })
        );
        getImageMetadataMock.mockImplementationOnce(() => Promise.resolve(imageMetadata));
        resizeNftMock.mockImplementationOnce(() => sharp);
        createResizedNFStudioLayerLogoMock.mockImplementationOnce(() =>
            Promise.resolve(nfstudioLayer)
        );
        toBufferMock.mockImplementationOnce(() => Promise.resolve(firstImage));
        toBufferMock.mockImplementationOnce(() => Promise.resolve(expectedResult));

        // exercise
        const result = await preview({
            src,
            width,
            height,
            atRight,
            coverStyle,
            mobile,
            collection
        });

        // verify
        expect(result).toEqual(expectedResult);
        expect(createResizedNFStudioLayerLogoMock).toHaveBeenNthCalledWith(1, width);
        expect(constructorMock).toHaveBeenNthCalledWith(2, firstImage);
        expect(compositeMock).toHaveBeenNthCalledWith(1, [
            {
                input: nfstudioLayer,
                blend: 'over',
                gravity: 'centre'
            }
        ]);
        expect(webpMock).toHaveBeenNthCalledWith(2, { quality: 30 });
        expect(toBufferMock).toHaveBeenNthCalledWith(2);
        expect(blurMock).toHaveBeenNthCalledWith(1, 1);
    });
});
