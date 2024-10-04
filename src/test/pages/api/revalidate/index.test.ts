import type { NextApiRequest, NextApiResponse } from 'next';
import { describe, expect, it, vi, afterEach, beforeAll, afterAll } from 'vitest';
import { createMocks, type MockResponse } from 'node-mocks-http';
import RevalidateHandler from '@/pages/api/revalidate';

const { captureExceptionMock, revalidateMock } = vi.hoisted(() => ({
    captureExceptionMock: vi.fn(),
    revalidateMock: vi.fn().mockImplementation(() => Promise.resolve())
}));

vi.mock('@sentry/nextjs', () => ({
    captureException: captureExceptionMock
}));

describe('pages/api/revalidate/index', () => {
    beforeAll(() => {
        vi.stubEnv('REVALIDATE_SECRET', 'correct');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    afterAll(() => {
        vi.unstubAllEnvs();
    });

    it('should not allow unauthorized calls if no query', async () => {
        // setup
        const { req, res } = createMocks() as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await RevalidateHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(401);
        expect(response._getData()).toEqual('Unauthorized.');
        expect(response._isEndCalled()).toBe(true);
    });

    it('should not allow unauthorized calls if invalid path - case 1', async () => {
        // setup
        const query = { secret: 'correct', path: '/invalid' };
        const { req, res } = createMocks({ query }) as {
            req: NextApiRequest;
            res: NextApiResponse;
        };

        // exercise
        const response = (await RevalidateHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(401);
        expect(response._getData()).toEqual('Unauthorized.');
        expect(response._isEndCalled()).toBe(true);
    });

    it('should not allow unauthorized calls if invalid path - case 2', async () => {
        // setup
        const query = { secret: 'correct', path: '/faq/invalid' };
        const { req, res } = createMocks({ query }) as {
            req: NextApiRequest;
            res: NextApiResponse;
        };

        // exercise
        const response = (await RevalidateHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(401);
        expect(response._getData()).toEqual('Unauthorized.');
        expect(response._isEndCalled()).toBe(true);
    });

    it('should not allow unauthorized calls if invalid path - case 3', async () => {
        // setup
        const query = { secret: 'correct', path: '/collections/invalid-name' };
        const { req, res } = createMocks({ query }) as {
            req: NextApiRequest;
            res: NextApiResponse;
        };

        // exercise
        const response = (await RevalidateHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(401);
        expect(response._getData()).toEqual('Unauthorized.');
        expect(response._isEndCalled()).toBe(true);
    });

    it('should not allow unauthorized calls if invalid path - case 4', async () => {
        // setup
        const query = { secret: 'correct', path: '/collections/name/invalid' };
        const { req, res } = createMocks({ query }) as {
            req: NextApiRequest;
            res: NextApiResponse;
        };

        // exercise
        const response = (await RevalidateHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(401);
        expect(response._getData()).toEqual('Unauthorized.');
        expect(response._isEndCalled()).toBe(true);
    });

    it('should not allow unauthorized calls if invalid path - case 5', async () => {
        // setup
        const query = { secret: 'correct', path: '' };
        const { req, res } = createMocks({ query }) as {
            req: NextApiRequest;
            res: NextApiResponse;
        };

        // exercise
        const response = (await RevalidateHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(401);
        expect(response._getData()).toEqual('Unauthorized.');
        expect(response._isEndCalled()).toBe(true);
    });

    it('should not allow unauthorized calls if invalid secret', async () => {
        // setup
        const query = { secret: 'wrong', path: '/' };
        const { req, res } = createMocks({ query }) as {
            req: NextApiRequest;
            res: NextApiResponse;
        };

        // exercise
        const response = (await RevalidateHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(401);
        expect(response._getData()).toEqual('Unauthorized.');
        expect(response._isEndCalled()).toBe(true);
    });

    it('should revalidate pages', async () => {
        const query = { secret: 'correct', path: '/' };
        const { req, res } = createMocks({ query }) as {
            req: NextApiRequest;
            res: NextApiResponse;
        };
        res.revalidate = revalidateMock;

        // exercise
        const response = (await RevalidateHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(200);
        expect(response._getJSONData()).toEqual({ revalidated: true });
        expect(response._getHeaders()['cache-control']).toEqual('no-store');
        expect(response._isEndCalled()).toBe(true);
        expect(revalidateMock).toHaveBeenNthCalledWith(1, query.path);
    });

    it('should return 500 on error', async () => {
        // setup
        const error = { error: 'cause' };
        revalidateMock.mockRejectedValueOnce(error);
        const query = { secret: 'correct', path: '/' };
        const { req, res } = createMocks({ query }) as {
            req: NextApiRequest;
            res: NextApiResponse;
        };
        res.revalidate = revalidateMock;

        // exercise
        const response = (await RevalidateHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(500);
        expect(response._getData()).toEqual(`Error revalidating ${query.path}`);
        expect(response._isEndCalled()).toBe(true);
        expect(revalidateMock).toHaveBeenNthCalledWith(1, query.path);
        expect(captureExceptionMock).toHaveBeenNthCalledWith(1, error);
    });
});
