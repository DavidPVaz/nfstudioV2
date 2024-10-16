import type { NextRequest } from 'next/server';
import { NextURL } from 'next/dist/server/web/next-url';
import { describe, expect, it, vi, afterEach, beforeAll, afterAll } from 'vitest';
import { GET as RevalidateHandler } from '@/app/api/revalidate/route';

const { captureExceptionMock, revalidatePathMock } = vi.hoisted(() => ({
    captureExceptionMock: vi.fn(),
    revalidatePathMock: vi.fn()
}));

vi.mock('@sentry/nextjs', () => ({
    captureException: captureExceptionMock
}));

vi.mock('next/cache', () => ({
    revalidatePath: revalidatePathMock
}));

const BASE_PATH = 'http://localhost:3000';

const buildRequest = (path = BASE_PATH) =>
    ({
        nextUrl: new NextURL(path)
    }) as NextRequest;

describe('app/api/revalidate/route', () => {
    beforeAll(() => {
        vi.stubEnv('SECRET', 'correct');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    afterAll(() => {
        vi.unstubAllEnvs();
    });

    it('should not allow unauthorized calls if no query', () => {
        // exercise
        const response = RevalidateHandler(buildRequest());

        // verify
        expect(response.status).toEqual(401);
        expect(response.body).toEqual(null);
        expect(response.ok).toEqual(false);
    });

    it('should not allow unauthorized calls if invalid path - case 1', () => {
        // exercise
        const response = RevalidateHandler(
            buildRequest(`${BASE_PATH}?secret=correct&path=/invalid`)
        );

        // verify
        expect(response.status).toEqual(401);
        expect(response.body).toEqual(null);
        expect(response.ok).toEqual(false);
    });

    it('should not allow unauthorized calls if invalid path - case 2', () => {
        // exercise
        const response = RevalidateHandler(
            buildRequest(`${BASE_PATH}?secret=correct&path=/faq/invalid`)
        );

        // verify
        expect(response.status).toEqual(401);
        expect(response.body).toEqual(null);
        expect(response.ok).toEqual(false);
    });

    it('should not allow unauthorized calls if invalid path - case 3', () => {
        // exercise
        const response = RevalidateHandler(
            buildRequest(`${BASE_PATH}?secret=correct&path=/collections/invalid-name`)
        );

        // verify
        expect(response.status).toEqual(401);
        expect(response.body).toEqual(null);
        expect(response.ok).toEqual(false);
    });

    it('should not allow unauthorized calls if invalid path - case 4', () => {
        // exercise
        const response = RevalidateHandler(
            buildRequest(`${BASE_PATH}?secret=correct&path=/collections/name/invalid`)
        );

        // verify
        expect(response.status).toEqual(401);
        expect(response.body).toEqual(null);
        expect(response.ok).toEqual(false);
    });

    it('should not allow unauthorized calls if invalid path - case 5', () => {
        // exercise
        const response = RevalidateHandler(buildRequest(`${BASE_PATH}?secret=correct&path=`));

        // verify
        expect(response.status).toEqual(401);
        expect(response.body).toEqual(null);
        expect(response.ok).toEqual(false);
    });

    it('should not allow unauthorized calls if invalid secret', () => {
        // exercise
        const response = RevalidateHandler(buildRequest(`${BASE_PATH}?secret=wrong&path=/`));

        // verify
        expect(response.status).toEqual(401);
        expect(response.body).toEqual(null);
        expect(response.ok).toEqual(false);
    });

    it('should revalidate pages', async () => {
        // exercise
        const response = RevalidateHandler(buildRequest(`${BASE_PATH}?secret=correct&path=/faq`));

        // verify
        expect(response.status).toEqual(200);
        expect(response.ok).toEqual(true);
        expect(await response.json()).toEqual({ revalidated: true });
        expect(revalidatePathMock).toHaveBeenNthCalledWith(1, '/faq');
    });

    it('should return 500 on error', async () => {
        // setup
        const error = new Error('cause');
        revalidatePathMock.mockImplementationOnce(() => {
            throw error;
        });

        // exercise
        const response = RevalidateHandler(buildRequest(`${BASE_PATH}?secret=correct&path=/`));

        // verify
        expect(response.status).toEqual(500);
        expect(response.ok).toEqual(false);
        expect(await response.text()).toEqual('An unexpected error occurred while revalidating /');
        expect(revalidatePathMock).toHaveBeenNthCalledWith(1, '/');
        expect(captureExceptionMock).toHaveBeenNthCalledWith(1, error);
    });
});
