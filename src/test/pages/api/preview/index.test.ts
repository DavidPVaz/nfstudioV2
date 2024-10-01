/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { NextApiRequest, NextApiResponse } from 'next';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createMocks, type MockResponse } from 'node-mocks-http';
import PreviewHandler from '@/pages/api/preview';
import { getOptionsMinMaxConfig } from '@/lib/utils';

const { width, height } = getOptionsMinMaxConfig();
const PREVIEW_IMAGE = Buffer.from('test');

const previewData = {
    src: 'https://asadasdasd.png',
    width: `${width.min + 10}`,
    height: `${height.min + 10}`,
    atRight: 'true',
    coverStyle: 'false',
    mobile: 'true',
    logoSrc: 'url/name-logo.png',
    collection: 'collection_name'
};

const { previewMock, captureExceptionMock } = vi.hoisted(() => ({
    previewMock: vi.fn().mockImplementation(() => Promise.resolve(PREVIEW_IMAGE)),
    captureExceptionMock: vi.fn()
}));

vi.mock('@/server/service/nft-converter', () => ({
    preview: previewMock
}));

vi.mock('@sentry/nextjs', () => ({
    captureException: captureExceptionMock
}));

describe('pages/api/preview/index', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should return 400 if no query', async () => {
        // setup
        const query = {};
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await PreviewHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(previewMock).not.toHaveBeenCalled();
    });

    it('should return 400 if invalid query', async () => {
        // setup
        const query = { invalid: 'type' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await PreviewHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(previewMock).not.toHaveBeenCalled();
    });

    it('should return 400 if no src', async () => {
        // setup
        const query = { ...previewData, src: undefined };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await PreviewHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(previewMock).not.toHaveBeenCalled();
    });

    it('should return 400 if invalid src', async () => {
        // setup
        const query = { ...previewData, src: '222723' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await PreviewHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(previewMock).not.toHaveBeenCalled();
    });

    it('should return 400 if width is not a number', async () => {
        // setup
        const query = { ...previewData, width: 'invalid' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await PreviewHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(previewMock).not.toHaveBeenCalled();
    });

    it('should return 400 if width is below min', async () => {
        // setup
        const query = { ...previewData, width: `${width.min - 1}` };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await PreviewHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(previewMock).not.toHaveBeenCalled();
    });

    it('should return 400 if width is above max', async () => {
        // setup
        const query = { ...previewData, width: `${width.max + 1}` };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await PreviewHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(previewMock).not.toHaveBeenCalled();
    });

    it('should return 400 if height is not a number', async () => {
        // setup
        const query = { ...previewData, height: 'invalid' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await PreviewHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(previewMock).not.toHaveBeenCalled();
    });

    it('should return 400 if height is below min', async () => {
        // setup
        const query = { ...previewData, height: `${height.min - 1}` };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await PreviewHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(previewMock).not.toHaveBeenCalled();
    });

    it('should return 400 if height is above max', async () => {
        // setup
        const query = { ...previewData, height: `${height.max + 1}` };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await PreviewHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(previewMock).not.toHaveBeenCalled();
    });

    it('should return 400 if atRight is not a boolean', async () => {
        // setup
        const query = { ...previewData, atRight: 'invalid' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await PreviewHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(previewMock).not.toHaveBeenCalled();
    });

    it('should return 400 if coverStyle is not a boolean', async () => {
        // setup
        const query = { ...previewData, coverStyle: 'invalid' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await PreviewHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(previewMock).not.toHaveBeenCalled();
    });

    it('should return 400 if mobile is not a boolean', async () => {
        // setup
        const query = { ...previewData, mobile: 'invalid' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await PreviewHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(previewMock).not.toHaveBeenCalled();
    });

    it('should return 400 if not collection', async () => {
        // setup
        const query = { ...previewData, collection: undefined };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await PreviewHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(previewMock).not.toHaveBeenCalled();
    });

    it('should return 400 if invalid collection', async () => {
        // setup
        const query = { ...previewData, collection: 'invalid_nam3' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await PreviewHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(previewMock).not.toHaveBeenCalled();
    });

    it('should return 400 if invalid logoSrc', async () => {
        // setup
        const query = { ...previewData, logoSrc: '23232' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await PreviewHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(previewMock).not.toHaveBeenCalled();
    });

    it('should return 400 if maxAge is not a number', async () => {
        // setup
        const query = { src: 'src', maxAge: 'invalid' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await PreviewHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(previewMock).not.toHaveBeenCalled();
    });

    it('should return 400 if maxAge is below min', async () => {
        // setup
        const query = { src: 'src', maxAge: '-1' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await PreviewHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(previewMock).not.toHaveBeenCalled();
    });

    it('should return 400 if maxAge is above max', async () => {
        // setup
        const query = { src: 'src', maxAge: '31536001' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await PreviewHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(previewMock).not.toHaveBeenCalled();
    });

    it('should return 400 if sMaxAge is not a number', async () => {
        // setup
        const query = { src: 'src', sMaxAge: 'invalid' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await PreviewHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(previewMock).not.toHaveBeenCalled();
    });

    it('should return 400 if sMaxAge is below min', async () => {
        // setup
        const query = { src: 'src', sMaxAge: '-1' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await PreviewHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(previewMock).not.toHaveBeenCalled();
    });

    it('should return 400 if sMaxAge is above max', async () => {
        // setup
        const query = { src: 'src', maxAge: '31536001' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await PreviewHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(previewMock).not.toHaveBeenCalled();
    });

    it('should create a preview', async () => {
        // setup
        const query = { ...previewData, maxAge: '100', sMaxAge: '200' };
        const expectedQuery = {
            src: previewData.src,
            width: width.min + 10,
            height: height.min + 10,
            atRight: true,
            coverStyle: false,
            mobile: true,
            logoSrc: previewData.logoSrc,
            collection: previewData.collection
        };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await PreviewHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(200);
        expect(response._getData()).toEqual(PREVIEW_IMAGE);
        expect(response._getHeaders()['cache-control']).toEqual(
            `max-age=${query.maxAge}, s-maxage=${query.sMaxAge}, public, stale-while-revalidate=60`
        );
        expect(response._getHeaders()['content-type']).toEqual('image/webp');
        expect(response._isEndCalled()).toBe(true);
        expect(previewMock).toHaveBeenNthCalledWith(1, expectedQuery);
    });

    it('should create a preview and set the cache control to the default values', async () => {
        // setup
        const defaultCacheValue = 31536000;
        const query = previewData;
        const expectedQuery = {
            src: previewData.src,
            width: width.min + 10,
            height: height.min + 10,
            atRight: true,
            coverStyle: false,
            mobile: true,
            logoSrc: previewData.logoSrc,
            collection: previewData.collection
        };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await PreviewHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(200);
        expect(response._getData()).toEqual(PREVIEW_IMAGE);
        expect(response._getHeaders()['cache-control']).toEqual(
            `max-age=${defaultCacheValue}, s-maxage=${defaultCacheValue}, public, stale-while-revalidate=60`
        );
        expect(response._getHeaders()['content-type']).toEqual('image/webp');
        expect(response._isEndCalled()).toBe(true);
        expect(previewMock).toHaveBeenNthCalledWith(1, expectedQuery);
    });

    it('should return 500 on error', async () => {
        // setup
        const error = { error: 'optimize error' };
        const query = previewData;
        const expectedQuery = {
            src: previewData.src,
            width: width.min + 10,
            height: height.min + 10,
            atRight: true,
            coverStyle: false,
            mobile: true,
            logoSrc: previewData.logoSrc,
            collection: previewData.collection
        };
        previewMock.mockRejectedValueOnce(error);
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await PreviewHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(500);
        expect(response._getData()).toEqual(
            'An unexpected error occurred while creating the preview.'
        );
        expect(response._isEndCalled()).toBe(true);
        expect(previewMock).toHaveBeenNthCalledWith(1, expectedQuery);
        expect(captureExceptionMock).toHaveBeenNthCalledWith(1, error);
    });
});
