import { describe, expect, vi, afterEach, it } from 'vitest';
import { optimize } from '@/server/service/image-loader';

const { fetchMock, decodeURIMock, constructorMock, resizeMock, webpMock, toBufferMock } =
    vi.hoisted(() => ({
        fetchMock: vi.fn(),
        decodeURIMock: vi.fn(),
        constructorMock: vi.fn(),
        resizeMock: vi.fn(),
        webpMock: vi.fn(),
        toBufferMock: vi.fn()
    }));

vi.mock('sharp', () => ({
    default: arg => {
        constructorMock(arg);

        return {
            resize: function (arg) {
                resizeMock(arg);
                return this;
            },
            webp: function (arg) {
                webpMock(arg);
                return this;
            },
            toBuffer: toBufferMock
        };
    }
}));

describe('server/service/image-loader/index', () => {
    global.fetch = fetchMock;
    global.decodeURI = decodeURIMock;

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should optimize an image', async () => {
        // setup
        const query = { src: 'some-url', width: '100', quality: '50' };
        const decodedUrl = 'https://decoded-url';
        const imageBuffer = Buffer.from('image');
        const optimized = Buffer.from('optimized');
        decodeURIMock.mockImplementationOnce(() => decodedUrl);
        fetchMock.mockImplementationOnce(() =>
            Promise.resolve({ arrayBuffer: () => Promise.resolve(imageBuffer) })
        );
        toBufferMock.mockImplementationOnce(() => Promise.resolve(optimized));

        // exercise
        const result = await optimize(query);

        // verify
        expect(result).toEqual(optimized);
        expect(decodeURIMock).toHaveBeenNthCalledWith(1, query.src);
        expect(fetchMock).toHaveBeenNthCalledWith(1, decodedUrl);
        expect(constructorMock).toHaveBeenNthCalledWith(1, new Uint8Array(imageBuffer));
        expect(resizeMock).toHaveBeenNthCalledWith(1, {
            withoutEnlargement: true,
            width: Number.parseInt(query.width, 10)
        });
        expect(webpMock).toHaveBeenNthCalledWith(1, {
            quality: Number.parseInt(query.quality, 10)
        });
        expect(toBufferMock).toHaveBeenNthCalledWith(1);
    });

    it('should optimize an image with default width and quality', async () => {
        // setup
        const query = { src: 'some-url' };
        const decodedUrl = 'https://decoded-url';
        const imageBuffer = Buffer.from('image');
        const optimized = Buffer.from('optimized');
        decodeURIMock.mockImplementationOnce(() => decodedUrl);
        fetchMock.mockImplementationOnce(() =>
            Promise.resolve({ arrayBuffer: () => Promise.resolve(imageBuffer) })
        );
        toBufferMock.mockImplementationOnce(() => Promise.resolve(optimized));

        // exercise
        const result = await optimize(query);

        // verify
        expect(result).toEqual(optimized);
        expect(decodeURIMock).toHaveBeenNthCalledWith(1, query.src);
        expect(fetchMock).toHaveBeenNthCalledWith(1, decodedUrl);
        expect(constructorMock).toHaveBeenNthCalledWith(1, new Uint8Array(imageBuffer));
        expect(resizeMock).toHaveBeenNthCalledWith(1, {
            withoutEnlargement: true,
            width: Number.parseInt('1000', 10)
        });
        expect(webpMock).toHaveBeenNthCalledWith(1, { quality: Number.parseInt('75', 10) });
        expect(toBufferMock).toHaveBeenNthCalledWith(1);
    });

    it('should optimize an image identified as CMS resource with its own image optimization API', async () => {
        // setup
        const query = { src: 'some-url', width: '100', quality: '50' };
        const decodedUrl = 'some-relative-cms-url-id';
        const imageBuffer = Buffer.from('image');
        const optimized = Buffer.from(imageBuffer);
        decodeURIMock.mockImplementationOnce(() => decodedUrl);
        fetchMock.mockImplementationOnce(() =>
            Promise.resolve({ arrayBuffer: () => Promise.resolve(imageBuffer) })
        );

        // exercise
        const result = await optimize(query);

        // verify
        expect(result).toEqual(optimized);
        expect(decodeURIMock).toHaveBeenNthCalledWith(1, query.src);
        expect(fetchMock).toHaveBeenNthCalledWith(
            1,
            `${process.env.CONTENTFUL_ASSET_ENDPOINT}/${decodedUrl}?fm=webp&w=${query.width}&q=${query.quality}`
        );

        expect(constructorMock).not.toHaveBeenCalled();
        expect(resizeMock).not.toHaveBeenCalled();
        expect(webpMock).not.toHaveBeenCalled();
        expect(toBufferMock).not.toHaveBeenCalled();
    });
});
