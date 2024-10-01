/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { NextApiRequest, NextApiResponse } from 'next';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createMocks, type MockResponse } from 'node-mocks-http';
import ImageLoaderHandler from '@/pages/api/image-loader';

const TEST_OPTIMIZED_IMAGE = Buffer.from('test');

const { optimizeMock, captureExceptionMock } = vi.hoisted(() => ({
    optimizeMock: vi.fn().mockImplementation(() => Promise.resolve(TEST_OPTIMIZED_IMAGE)),
    captureExceptionMock: vi.fn()
}));

vi.mock('@/server/service/image-loader', () => ({
    optimize: optimizeMock
}));

vi.mock('@sentry/nextjs', () => ({
    captureException: captureExceptionMock
}));

const loaderData = { src: 'some-valid/image.webp' };

describe('pages/api/image-loader/index', () => {
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
        const response = (await ImageLoaderHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(optimizeMock).not.toHaveBeenCalled();
    });

    it('should return 400 if invalid query', async () => {
        // setup
        const query = { invalid: 'type' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await ImageLoaderHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(optimizeMock).not.toHaveBeenCalled();
    });

    it('should return 400 if width is not a number', async () => {
        // setup
        const query = { ...loaderData, width: 'invalid' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await ImageLoaderHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(optimizeMock).not.toHaveBeenCalled();
    });

    it('should return 400 if width is below min', async () => {
        // setup
        const query = { ...loaderData, width: '49' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await ImageLoaderHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(optimizeMock).not.toHaveBeenCalled();
    });

    it('should return 400 if width is above max', async () => {
        // setup
        const query = { ...loaderData, width: '1001' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await ImageLoaderHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(optimizeMock).not.toHaveBeenCalled();
    });

    it('should return 400 if quality is not a number', async () => {
        // setup
        const query = { ...loaderData, quality: 'invalid' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await ImageLoaderHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(optimizeMock).not.toHaveBeenCalled();
    });

    it('should return 400 if quality is below min', async () => {
        // setup
        const query = { ...loaderData, quality: '9' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await ImageLoaderHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(optimizeMock).not.toHaveBeenCalled();
    });

    it('should return 400 if quality is above max', async () => {
        // setup
        const query = { ...loaderData, quality: '101' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await ImageLoaderHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(optimizeMock).not.toHaveBeenCalled();
    });

    it('should return 400 if maxAge is not a number', async () => {
        // setup
        const query = { ...loaderData, maxAge: 'invalid' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await ImageLoaderHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(optimizeMock).not.toHaveBeenCalled();
    });

    it('should return 400 if maxAge is below min', async () => {
        // setup
        const query = { ...loaderData, maxAge: '-1' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await ImageLoaderHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(optimizeMock).not.toHaveBeenCalled();
    });

    it('should return 400 if maxAge is above max', async () => {
        // setup
        const query = { ...loaderData, maxAge: '31536001' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await ImageLoaderHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(optimizeMock).not.toHaveBeenCalled();
    });

    it('should return 400 if sMaxAge is not a number', async () => {
        // setup
        const query = { ...loaderData, sMaxAge: 'invalid' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await ImageLoaderHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(optimizeMock).not.toHaveBeenCalled();
    });

    it('should return 400 if sMaxAge is below min', async () => {
        // setup
        const query = { ...loaderData, sMaxAge: '-1' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await ImageLoaderHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(optimizeMock).not.toHaveBeenCalled();
    });

    it('should return 400 if sMaxAge is above max', async () => {
        // setup
        const query = { ...loaderData, maxAge: '31536001' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await ImageLoaderHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(optimizeMock).not.toHaveBeenCalled();
    });

    it('should load an optimized image', async () => {
        // setup
        const query = { ...loaderData, maxAge: '100', sMaxAge: '200', width: '500', quality: '50' };
        const expectedQuery = { ...loaderData, width: 500, quality: 50 };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await ImageLoaderHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(200);
        expect(response._getData()).toEqual(TEST_OPTIMIZED_IMAGE);
        expect(response._getHeaders()['cache-control']).toEqual(
            `max-age=${query.maxAge}, s-maxage=${query.sMaxAge}, public, stale-while-revalidate=60`
        );
        expect(response._getHeaders()['content-type']).toEqual('image/webp');
        expect(response._isEndCalled()).toBe(true);
        expect(optimizeMock).toHaveBeenNthCalledWith(1, expectedQuery);
    });

    it('should load an optimized image and set the cache control to the default values', async () => {
        // setup
        const defaultCacheValue = 31536000;
        const query = { ...loaderData, width: '500', quality: '50' };
        const expectedQuery = { ...loaderData, width: 500, quality: 50 };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await ImageLoaderHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(200);
        expect(response._getData()).toEqual(TEST_OPTIMIZED_IMAGE);
        expect(response._getHeaders()['cache-control']).toEqual(
            `max-age=${defaultCacheValue}, s-maxage=${defaultCacheValue}, public, stale-while-revalidate=60`
        );
        expect(response._getHeaders()['content-type']).toEqual('image/webp');
        expect(response._isEndCalled()).toBe(true);
        expect(optimizeMock).toHaveBeenNthCalledWith(1, expectedQuery);
    });

    it('should return 500 on error', async () => {
        // setup
        const error = { error: 'optimize error' };
        const query = { ...loaderData, maxAge: '100', sMaxAge: '200', width: '500', quality: '50' };
        const expectedQuery = { ...loaderData, width: 500, quality: 50 };
        optimizeMock.mockRejectedValueOnce(error);
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await ImageLoaderHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(500);
        expect(response._getData()).toEqual(
            'An unexpected error occurred while optimizing the image.'
        );
        expect(response._isEndCalled()).toBe(true);
        expect(optimizeMock).toHaveBeenNthCalledWith(1, expectedQuery);
        expect(captureExceptionMock).toHaveBeenNthCalledWith(1, error);
    });
});
