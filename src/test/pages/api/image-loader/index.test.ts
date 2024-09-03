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

describe('pages/api/image-loader/index', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should return 400 if invalid query', async () => {
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

    it('should load an optimized image', async () => {
        // setup
        const query = { maxAge: '100', sMaxAge: '200', src: 'source', width: '500', quality: '50' };
        const expectedQuery = { maxAge: 100, sMaxAge: 200, src: 'source', width: 500, quality: 50 };
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

        expect(optimizeMock).toHaveBeenCalledWith(expectedQuery);
        expect(optimizeMock).toHaveBeenCalledOnce();
    });

    it('should load an optimized image and set the cache control to the default values', async () => {
        // setup
        const defaultCacheValue = 31536000;
        const query = { src: 'source', width: '500', quality: '50' };
        const expectedQuery = { src: 'source', width: 500, quality: 50 };
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

        expect(optimizeMock).toHaveBeenCalledWith(expectedQuery);
        expect(optimizeMock).toHaveBeenCalledOnce();
    });

    it('should return 500 on error', async () => {
        // setup
        const error = { error: 'optimize error' };
        const query = { maxAge: '100', sMaxAge: '200', src: 'source', width: '500', quality: '50' };
        const expectedQuery = { maxAge: 100, sMaxAge: 200, src: 'source', width: 500, quality: 50 };
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
        expect(response._getData()).toEqual('An error occurred while optimizing the image.');
        expect(response._isEndCalled()).toBe(true);

        expect(optimizeMock).toHaveBeenCalledWith(expectedQuery);
        expect(optimizeMock).toHaveBeenCalledOnce();

        expect(captureExceptionMock).toHaveBeenCalledWith(error);
        expect(captureExceptionMock).toHaveBeenCalledOnce();
    });
});
