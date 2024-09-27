/* eslint-disable @typescript-eslint/no-unsafe-return */
import { describe, expect, vi, afterEach, it } from 'vitest';
import type { Sharp } from 'sharp';
import {
    getImageMetadata,
    resizeNft,
    createResizedLogo,
    getLogoPosition,
    createResizedNFStudioLayerLogo
} from '@/server/service/nft-converter/core';

const {
    module,
    sharp,
    fetchMock,
    constructorMock,
    resizeMock,
    trimMock,
    blurMock,
    toBufferMock,
    getCollectionCustomizationMock
} = vi.hoisted(() => {
    const sharp = {
        resize: function (arg) {
            resizeMock(arg);
            return this;
        },
        trim: function () {
            trimMock();
            return this;
        },
        blur: function (arg) {
            blurMock(arg);
            return this;
        },
        toBuffer: function () {
            return toBufferMock();
        }
    } as Sharp;

    const sharpModule = function (arg) {
        return constructorMock(arg);
    };
    sharpModule.fit = { contain: 'contain', cover: 'cover' };

    return {
        module: sharpModule,
        sharp,
        fetchMock: vi.fn(),
        constructorMock: vi.fn(),
        resizeMock: vi.fn(),
        trimMock: vi.fn(),
        blurMock: vi.fn(),
        toBufferMock: vi.fn(),
        getCollectionCustomizationMock: vi.fn()
    };
});

vi.mock('sharp', () => ({
    default: module
}));

vi.mock('@/server/service/nft-converter/customization', () => ({
    getCollectionCustomization: getCollectionCustomizationMock
}));

describe('server/service/nft-converter/core', () => {
    global.fetch = fetchMock;

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should get image metadata', async () => {
        // setup
        const metadata = { channels: 0, width: 20, height: 10 };
        const bufferData = [1, 2, 3];
        const image = {
            metadata: vi.fn().mockImplementation(() => Promise.resolve(metadata)),
            raw: vi.fn().mockImplementation(function (this: Sharp) {
                return this;
            }),
            toBuffer: vi.fn().mockImplementation(() => Promise.resolve(bufferData))
        } as unknown as Sharp;

        // exercise
        const result = await getImageMetadata(image);

        // verify
        expect(result).toEqual({
            background: { r: 1, g: 2, b: 3 },
            width: metadata.width,
            height: metadata.height
        });

        expect(image.metadata).toHaveBeenNthCalledWith(1);
        expect(image.raw).toHaveBeenNthCalledWith(1);
        expect(image.toBuffer).toHaveBeenNthCalledWith(1);
    });

    it('should resize the nft', () => {
        // setup
        const nft = sharp;
        const width = 100;
        const height = 50;
        const background = { r: 1, g: 2, b: 3 };

        // exercise && verify
        const result1 = resizeNft({
            nft,
            width,
            height,
            background,
            mobile: true,
            atRight: false,
            coverStyle: false,
            collection: 'name'
        });
        expect(result1).toEqual(sharp);
        expect(resizeMock).toHaveBeenCalledWith({
            width,
            height,
            fit: 'contain',
            position: 'bottom',
            withoutEnlargement: false,
            background
        });
        expect(getCollectionCustomizationMock).toHaveBeenCalledWith('name');

        const result2 = resizeNft({
            nft,
            width,
            height,
            background,
            mobile: false,
            atRight: false,
            coverStyle: false,
            collection: 'name'
        });
        expect(result2).toEqual(sharp);
        expect(resizeMock).toHaveBeenCalledWith({
            width,
            height,
            fit: 'contain',
            position: 'bottom',
            withoutEnlargement: false,
            background
        });
        expect(getCollectionCustomizationMock).toHaveBeenCalledWith('name');

        const result3 = resizeNft({
            nft,
            width,
            height,
            background,
            mobile: false,
            atRight: true,
            coverStyle: false,
            collection: 'name'
        });
        expect(result3).toEqual(sharp);
        expect(resizeMock).toHaveBeenCalledWith({
            width,
            height,
            fit: 'contain',
            position: 'right bottom',
            withoutEnlargement: false,
            background
        });
        expect(getCollectionCustomizationMock).toHaveBeenCalledWith('name');

        const result4 = resizeNft({
            nft,
            width,
            height,
            background,
            mobile: true,
            atRight: false,
            coverStyle: true,
            collection: 'name'
        });
        expect(result4).toEqual(sharp);
        expect(resizeMock).toHaveBeenCalledWith({
            width,
            height,
            fit: 'cover',
            position: 'centre',
            withoutEnlargement: false,
            background
        });
        expect(getCollectionCustomizationMock).toHaveBeenCalledWith('name');

        const result5 = resizeNft({
            nft,
            width,
            height,
            background,
            mobile: false,
            atRight: false,
            coverStyle: true,
            collection: 'name'
        });
        expect(result5).toEqual(sharp);
        expect(resizeMock).toHaveBeenCalledWith({
            width,
            height,
            fit: 'contain',
            position: 'bottom',
            withoutEnlargement: false,
            background
        });
        expect(getCollectionCustomizationMock).toHaveBeenCalledWith('name');

        expect(getCollectionCustomizationMock).toHaveBeenCalledTimes(5);
    });

    it('should apply the customization and do the resize', () => {
        // setup
        const nft = { resize: vi.fn().mockImplementationOnce(() => 'result') } as unknown as Sharp;
        const customizationFunction = vi.fn().mockImplementation(() => nft);
        getCollectionCustomizationMock.mockImplementationOnce(() => customizationFunction);
        const width = 100;
        const height = 50;
        const background = { r: 1, g: 2, b: 3 };

        // exercise && verify
        resizeNft({
            nft: sharp,
            width,
            height,
            background,
            mobile: true,
            atRight: false,
            coverStyle: false,
            collection: 'name'
        });
        expect(nft.resize).toHaveBeenCalledWith({
            width,
            height,
            fit: 'contain',
            position: 'bottom',
            withoutEnlargement: false,
            background
        });
        expect(resizeMock).not.toHaveBeenCalled();

        expect(getCollectionCustomizationMock).toHaveBeenNthCalledWith(1, 'name');
        expect(customizationFunction).toHaveBeenNthCalledWith(1, sharp);
    });

    it('should create a resized logo with height option when not mobile - case 1', async () => {
        // setup
        const logoSrc = 'logo-url';
        const expectedUrl = `${process.env.CONTENTFUL_ASSET_ENDPOINT}/${logoSrc}`;
        const metadata = { channels: 0, width: 200, height: 250 };
        const bufferData = [1, 2, 3];
        const image = {
            metadata: vi.fn().mockImplementation(() => Promise.resolve(metadata)),
            raw: vi.fn().mockImplementation(function (this: Sharp) {
                return this;
            }),
            toBuffer: vi.fn().mockImplementation(() => Promise.resolve(bufferData))
        };
        const logoImageBuffer = Buffer.from(logoSrc);
        fetchMock.mockImplementationOnce(() =>
            Promise.resolve({ arrayBuffer: () => Promise.resolve(logoImageBuffer) })
        );
        constructorMock.mockImplementationOnce(() => image);
        constructorMock.mockImplementationOnce(() => sharp);
        const expectedResult = Buffer.from('created-logo');
        toBufferMock.mockImplementationOnce(() => Promise.resolve(expectedResult));

        // exercise
        const result = await createResizedLogo({
            logoSrc,
            width: 1500,
            height: 500,
            mobile: false
        });

        // verify
        expect(result).toEqual(expectedResult);
        expect(fetchMock).toHaveBeenNthCalledWith(1, expectedUrl);
        expect(constructorMock).toHaveBeenNthCalledWith(2, new Uint8Array(logoImageBuffer));
        expect(resizeMock).toHaveBeenNthCalledWith(1, {
            fit: 'contain',
            position: 'center',
            height: 175
        });
        expect(toBufferMock).toHaveBeenNthCalledWith(1);

        expect(blurMock).not.toHaveBeenCalled();
    });

    it('should override the height if the new width is too wide - nested case 1', async () => {
        // setup
        const logoSrc = 'logo-url';
        const expectedUrl = `${process.env.CONTENTFUL_ASSET_ENDPOINT}/${logoSrc}`;
        const metadata = { channels: 0, width: 600, height: 250 };
        const bufferData = [1, 2, 3];
        const image = {
            metadata: vi.fn().mockImplementation(() => Promise.resolve(metadata)),
            raw: vi.fn().mockImplementation(function (this: Sharp) {
                return this;
            }),
            toBuffer: vi.fn().mockImplementation(() => Promise.resolve(bufferData))
        };
        const logoImageBuffer = Buffer.from(logoSrc);
        fetchMock.mockImplementationOnce(() =>
            Promise.resolve({ arrayBuffer: () => Promise.resolve(logoImageBuffer) })
        );
        constructorMock.mockImplementationOnce(() => image);
        constructorMock.mockImplementationOnce(() => sharp);
        const expectedResult = Buffer.from('created-logo');
        toBufferMock.mockImplementationOnce(() => Promise.resolve(expectedResult));

        // exercise
        const result = await createResizedLogo({
            logoSrc,
            width: 1500,
            height: 500,
            mobile: false
        });

        // verify
        expect(result).toEqual(expectedResult);
        expect(fetchMock).toHaveBeenNthCalledWith(1, expectedUrl);
        expect(constructorMock).toHaveBeenNthCalledWith(2, new Uint8Array(logoImageBuffer));
        expect(resizeMock).toHaveBeenNthCalledWith(1, {
            fit: 'contain',
            position: 'center',
            width: 375
        });
        expect(toBufferMock).toHaveBeenNthCalledWith(1);

        expect(blurMock).not.toHaveBeenCalled();
    });

    it('should create a resized logo with width option if not mobile - case 2', async () => {
        // setup
        const logoSrc = 'logo-url';
        const expectedUrl = `${process.env.CONTENTFUL_ASSET_ENDPOINT}/${logoSrc}`;
        const metadata = { channels: 0, width: 376, height: 151 };
        const bufferData = [1, 2, 3];
        const image = {
            metadata: vi.fn().mockImplementation(() => Promise.resolve(metadata)),
            raw: vi.fn().mockImplementation(function (this: Sharp) {
                return this;
            }),
            toBuffer: vi.fn().mockImplementation(() => Promise.resolve(bufferData))
        };
        const logoImageBuffer = Buffer.from(logoSrc);
        fetchMock.mockImplementationOnce(() =>
            Promise.resolve({ arrayBuffer: () => Promise.resolve(logoImageBuffer) })
        );
        constructorMock.mockImplementationOnce(() => image);
        constructorMock.mockImplementationOnce(() => sharp);
        const expectedResult = Buffer.from('created-logo');
        toBufferMock.mockImplementationOnce(() => Promise.resolve(expectedResult));

        // exercise
        const result = await createResizedLogo({
            logoSrc,
            width: 1500,
            height: 500,
            mobile: false
        });

        // verify
        expect(result).toEqual(expectedResult);
        expect(fetchMock).toHaveBeenNthCalledWith(1, expectedUrl);
        expect(constructorMock).toHaveBeenNthCalledWith(2, new Uint8Array(logoImageBuffer));
        expect(resizeMock).toHaveBeenNthCalledWith(1, {
            fit: 'contain',
            position: 'center',
            width: 375
        });
        expect(toBufferMock).toHaveBeenNthCalledWith(1);

        expect(blurMock).not.toHaveBeenCalled();
    });

    it('should create a resized logo with height option when not mobile - case 3', async () => {
        // setup
        const logoSrc = 'logo-url';
        const expectedUrl = `${process.env.CONTENTFUL_ASSET_ENDPOINT}/${logoSrc}`;
        const metadata = { channels: 0, width: 200, height: 101 };
        const bufferData = [1, 2, 3];
        const image = {
            metadata: vi.fn().mockImplementation(() => Promise.resolve(metadata)),
            raw: vi.fn().mockImplementation(function (this: Sharp) {
                return this;
            }),
            toBuffer: vi.fn().mockImplementation(() => Promise.resolve(bufferData))
        };
        const logoImageBuffer = Buffer.from(logoSrc);
        fetchMock.mockImplementationOnce(() =>
            Promise.resolve({ arrayBuffer: () => Promise.resolve(logoImageBuffer) })
        );
        constructorMock.mockImplementationOnce(() => image);
        constructorMock.mockImplementationOnce(() => sharp);
        const expectedResult = Buffer.from('created-logo');
        toBufferMock.mockImplementationOnce(() => Promise.resolve(expectedResult));

        // exercise
        const result = await createResizedLogo({
            logoSrc,
            width: 1500,
            height: 500,
            mobile: false
        });

        // verify
        expect(result).toEqual(expectedResult);
        expect(fetchMock).toHaveBeenNthCalledWith(1, expectedUrl);
        expect(constructorMock).toHaveBeenNthCalledWith(2, new Uint8Array(logoImageBuffer));
        expect(resizeMock).toHaveBeenNthCalledWith(1, {
            fit: 'contain',
            position: 'center',
            height: 100
        });
        expect(toBufferMock).toHaveBeenNthCalledWith(1);

        expect(blurMock).not.toHaveBeenCalled();
    });

    it('should create a resized logo with height option when mobile - case 3', async () => {
        // setup
        const logoSrc = 'logo-url';
        const expectedUrl = `${process.env.CONTENTFUL_ASSET_ENDPOINT}/${logoSrc}`;
        const metadata = { channels: 0, width: 400, height: 501 };
        const bufferData = [1, 2, 3];
        const image = {
            metadata: vi.fn().mockImplementation(() => Promise.resolve(metadata)),
            raw: vi.fn().mockImplementation(function (this: Sharp) {
                return this;
            }),
            toBuffer: vi.fn().mockImplementation(() => Promise.resolve(bufferData))
        };
        const logoImageBuffer = Buffer.from(logoSrc);
        fetchMock.mockImplementationOnce(() =>
            Promise.resolve({ arrayBuffer: () => Promise.resolve(logoImageBuffer) })
        );
        constructorMock.mockImplementationOnce(() => image);
        constructorMock.mockImplementationOnce(() => sharp);
        const expectedResult = Buffer.from('created-logo');
        toBufferMock.mockImplementationOnce(() => Promise.resolve(expectedResult));

        // exercise
        const result = await createResizedLogo({
            logoSrc,
            width: 1440,
            height: 2500,
            mobile: true
        });

        // verify
        expect(result).toEqual(expectedResult);
        expect(fetchMock).toHaveBeenNthCalledWith(1, expectedUrl);
        expect(constructorMock).toHaveBeenNthCalledWith(2, new Uint8Array(logoImageBuffer));
        expect(resizeMock).toHaveBeenNthCalledWith(1, {
            fit: 'contain',
            position: 'center',
            height: 500
        });
        expect(toBufferMock).toHaveBeenNthCalledWith(1);

        expect(blurMock).not.toHaveBeenCalled();
    });

    it('should override the height if the new width is too wide - nested case 3', async () => {
        // setup
        const logoSrc = 'logo-url';
        const expectedUrl = `${process.env.CONTENTFUL_ASSET_ENDPOINT}/${logoSrc}`;
        const metadata = { channels: 0, width: 800, height: 501 };
        const bufferData = [1, 2, 3];
        const image = {
            metadata: vi.fn().mockImplementation(() => Promise.resolve(metadata)),
            raw: vi.fn().mockImplementation(function (this: Sharp) {
                return this;
            }),
            toBuffer: vi.fn().mockImplementation(() => Promise.resolve(bufferData))
        };
        const logoImageBuffer = Buffer.from(logoSrc);
        fetchMock.mockImplementationOnce(() =>
            Promise.resolve({ arrayBuffer: () => Promise.resolve(logoImageBuffer) })
        );
        constructorMock.mockImplementationOnce(() => image);
        constructorMock.mockImplementationOnce(() => sharp);
        const expectedResult = Buffer.from('created-logo');
        toBufferMock.mockImplementationOnce(() => Promise.resolve(expectedResult));

        // exercise
        const result = await createResizedLogo({
            logoSrc,
            width: 1440,
            height: 2500,
            mobile: true
        });

        // verify
        expect(result).toEqual(expectedResult);
        expect(fetchMock).toHaveBeenNthCalledWith(1, expectedUrl);
        expect(constructorMock).toHaveBeenNthCalledWith(2, new Uint8Array(logoImageBuffer));
        expect(resizeMock).toHaveBeenNthCalledWith(1, {
            fit: 'contain',
            position: 'center',
            width: 648
        });
        expect(toBufferMock).toHaveBeenNthCalledWith(1);

        expect(blurMock).not.toHaveBeenCalled();
    });

    it('should create a resized logo with default width option when mobile - case 4', async () => {
        // setup
        const logoSrc = 'logo-url';
        const expectedUrl = `${process.env.CONTENTFUL_ASSET_ENDPOINT}/${logoSrc}`;
        const metadata = { channels: 0, width: 20, height: 10 };
        const bufferData = [1, 2, 3];
        const image = {
            metadata: vi.fn().mockImplementation(() => Promise.resolve(metadata)),
            raw: vi.fn().mockImplementation(function (this: Sharp) {
                return this;
            }),
            toBuffer: vi.fn().mockImplementation(() => Promise.resolve(bufferData))
        };
        const logoImageBuffer = Buffer.from(logoSrc);
        fetchMock.mockImplementationOnce(() =>
            Promise.resolve({ arrayBuffer: () => Promise.resolve(logoImageBuffer) })
        );
        constructorMock.mockImplementationOnce(() => image);
        constructorMock.mockImplementationOnce(() => sharp);
        const expectedResult = Buffer.from('created-logo');
        toBufferMock.mockImplementationOnce(() => Promise.resolve(expectedResult));

        // exercise
        const result = await createResizedLogo({
            logoSrc,
            width: 1440,
            height: 2500,
            mobile: true
        });

        // verify
        expect(result).toEqual(expectedResult);
        expect(fetchMock).toHaveBeenNthCalledWith(1, expectedUrl);
        expect(constructorMock).toHaveBeenNthCalledWith(2, new Uint8Array(logoImageBuffer));
        expect(resizeMock).toHaveBeenNthCalledWith(1, {
            fit: 'contain',
            position: 'center',
            width: 648
        });
        expect(toBufferMock).toHaveBeenNthCalledWith(1);

        expect(blurMock).not.toHaveBeenCalled();
    });

    it('should create a resized logo with default width option when not mobile - case 4', async () => {
        // setup
        const logoSrc = 'logo-url';
        const expectedUrl = `${process.env.CONTENTFUL_ASSET_ENDPOINT}/${logoSrc}`;
        const metadata = { channels: 0, width: 20, height: 10 };
        const bufferData = [1, 2, 3];
        const image = {
            metadata: vi.fn().mockImplementation(() => Promise.resolve(metadata)),
            raw: vi.fn().mockImplementation(function (this: Sharp) {
                return this;
            }),
            toBuffer: vi.fn().mockImplementation(() => Promise.resolve(bufferData))
        };
        const logoImageBuffer = Buffer.from(logoSrc);
        fetchMock.mockImplementationOnce(() =>
            Promise.resolve({ arrayBuffer: () => Promise.resolve(logoImageBuffer) })
        );
        constructorMock.mockImplementationOnce(() => image);
        constructorMock.mockImplementationOnce(() => sharp);
        const expectedResult = Buffer.from('created-logo');
        toBufferMock.mockImplementationOnce(() => Promise.resolve(expectedResult));

        // exercise
        const result = await createResizedLogo({
            logoSrc,
            width: 1500,
            height: 500,
            mobile: false
        });

        // verify
        expect(result).toEqual(expectedResult);
        expect(fetchMock).toHaveBeenNthCalledWith(1, expectedUrl);
        expect(constructorMock).toHaveBeenNthCalledWith(2, new Uint8Array(logoImageBuffer));
        expect(resizeMock).toHaveBeenNthCalledWith(1, {
            fit: 'contain',
            position: 'center',
            width: 375
        });
        expect(toBufferMock).toHaveBeenNthCalledWith(1);

        expect(blurMock).not.toHaveBeenCalled();
    });

    it('should blur a resized logo', async () => {
        // setup
        const logoSrc = 'logo-url';
        const metadata = { channels: 0, width: 200, height: 250 };
        const bufferData = [1, 2, 3];
        const image = {
            metadata: vi.fn().mockImplementation(() => Promise.resolve(metadata)),
            raw: vi.fn().mockImplementation(function (this: Sharp) {
                return this;
            }),
            toBuffer: vi.fn().mockImplementation(() => Promise.resolve(bufferData))
        };
        const logoImageBuffer = Buffer.from(logoSrc);
        fetchMock.mockImplementationOnce(() =>
            Promise.resolve({ arrayBuffer: () => Promise.resolve(logoImageBuffer) })
        );
        constructorMock.mockImplementationOnce(() => image);
        constructorMock.mockImplementationOnce(() => sharp);
        const expectedResult = Buffer.from('created-logo');
        toBufferMock.mockImplementationOnce(() => Promise.resolve(expectedResult));

        // exercise
        const result = await createResizedLogo({
            logoSrc,
            width: 1500,
            height: 500,
            mobile: false,
            blur: true
        });

        // verify
        expect(result).toEqual(expectedResult);
        expect(blurMock).toHaveBeenNthCalledWith(1, 1);
    });

    it('should get the logo position', () => {
        // exercise && verify
        expect(
            getLogoPosition({
                width: 1440,
                height: 2000,
                logoWidth: 500,
                logoHeight: 300,
                mobile: true,
                atRight: false
            })
        ).toEqual({ top: 100, left: 470 });
        expect(
            getLogoPosition({
                width: 1500,
                height: 500,
                logoWidth: 100,
                logoHeight: 50,
                mobile: false,
                atRight: true
            })
        ).toEqual({ top: 225, left: 150 });
        expect(
            getLogoPosition({
                width: 1500,
                height: 500,
                logoWidth: 100,
                logoHeight: 50,
                mobile: false,
                atRight: false
            })
        ).toEqual({ top: 10, left: 1390 });
    });

    it('should create a resized NFStudio layer logo', async () => {
        // setup
        const nfstudioLayer = `${process.env.CONTENTFUL_ASSET_ENDPOINT}/1WHDZHPuu905hw4EadDRZI/40eaf60a7caf7bff7c13d8014391d89a/watermark.png`;
        const layerBuffer = Buffer.from(nfstudioLayer);
        fetchMock.mockImplementationOnce(() =>
            Promise.resolve({ arrayBuffer: () => Promise.resolve(layerBuffer) })
        );
        constructorMock.mockImplementationOnce(() => sharp);
        const expectedResult = Buffer.from('created-layer');
        toBufferMock.mockImplementationOnce(() => Promise.resolve(expectedResult));

        // exercise
        const result = await createResizedNFStudioLayerLogo(1500);

        // verify
        expect(result).toEqual(expectedResult);

        expect(fetchMock).toHaveBeenNthCalledWith(1, nfstudioLayer);
        expect(constructorMock).toHaveBeenNthCalledWith(1, new Uint8Array(layerBuffer));
        expect(resizeMock).toHaveBeenNthCalledWith(1, {
            fit: 'contain',
            position: 'center',
            width: 1125
        });
        expect(trimMock).toHaveBeenNthCalledWith(1);
        expect(toBufferMock).toHaveBeenNthCalledWith(1);
    });
});
