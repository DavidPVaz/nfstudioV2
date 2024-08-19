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

describe('server/service/image-loader', () => {
    global.fetch = fetchMock;
    global.decodeURI = decodeURIMock;

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should optimize an image', async () => {
        // setup
        const query = { url: 'some-url', width: '100', quality: '50' };
        const decodedUrl = 'decoded-url';
        const expectedUrl = `${process.env.CONTENTFUL_ASSET_ENDPOINT}/${decodedUrl}`;
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
        expect(decodeURIMock).toHaveBeenCalledWith(query.url);
        expect(decodeURIMock).toHaveBeenCalledOnce();
        expect(fetchMock).toHaveBeenCalledWith(expectedUrl);
        expect(fetchMock).toHaveBeenCalledOnce();

        expect(constructorMock).toHaveBeenCalledWith(new Uint8Array(imageBuffer));
        expect(constructorMock).toHaveBeenCalledOnce();
        expect(resizeMock).toHaveBeenCalledWith({
            withoutEnlargement: true,
            width: Number.parseInt(query.width, 10)
        });
        expect(resizeMock).toHaveBeenCalledOnce();
        expect(webpMock).toHaveBeenCalledWith({ quality: Number.parseInt(query.quality, 10) });
        expect(webpMock).toHaveBeenCalledOnce();
        expect(toBufferMock).toHaveBeenCalledWith();
        expect(toBufferMock).toHaveBeenCalledOnce();
    });

    it('should optimize an image with default width and quality', async () => {
        // setup
        const query = { url: 'some-url' };
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
        expect(decodeURIMock).toHaveBeenCalledWith(query.url);
        expect(decodeURIMock).toHaveBeenCalledOnce();
        expect(fetchMock).toHaveBeenCalledWith(decodedUrl);
        expect(fetchMock).toHaveBeenCalledOnce();

        expect(constructorMock).toHaveBeenCalledWith(new Uint8Array(imageBuffer));
        expect(constructorMock).toHaveBeenCalledOnce();
        expect(resizeMock).toHaveBeenCalledWith({
            withoutEnlargement: true,
            width: Number.parseInt('1000', 10)
        });
        expect(resizeMock).toHaveBeenCalledOnce();
        expect(webpMock).toHaveBeenCalledWith({ quality: Number.parseInt('75', 10) });
        expect(webpMock).toHaveBeenCalledOnce();
        expect(toBufferMock).toHaveBeenCalledWith();
        expect(toBufferMock).toHaveBeenCalledOnce();
    });

    it('should optimize an image identified as CMS resource', async () => {
        // setup
        const query = { url: 'some-url' };
        const decodedUrl = 'some-relative-cms-url-id';
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
        expect(decodeURIMock).toHaveBeenCalledWith(query.url);
        expect(decodeURIMock).toHaveBeenCalledOnce();
        expect(fetchMock).toHaveBeenCalledWith(
            `${process.env.CONTENTFUL_ASSET_ENDPOINT}/${decodedUrl}`
        );
        expect(fetchMock).toHaveBeenCalledOnce();

        expect(constructorMock).toHaveBeenCalledWith(new Uint8Array(imageBuffer));
        expect(constructorMock).toHaveBeenCalledOnce();
        expect(resizeMock).toHaveBeenCalledWith({
            withoutEnlargement: true,
            width: Number.parseInt('1000', 10)
        });
        expect(resizeMock).toHaveBeenCalledOnce();
        expect(webpMock).toHaveBeenCalledWith({ quality: Number.parseInt('75', 10) });
        expect(webpMock).toHaveBeenCalledOnce();
        expect(toBufferMock).toHaveBeenCalledWith();
        expect(toBufferMock).toHaveBeenCalledOnce();
    });
});
