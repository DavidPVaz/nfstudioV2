import { describe, expect, vi, afterEach, it } from 'vitest';
import { runMiddleware, getIP, isFromVercel } from '@/server/middleware/shared';

const buildRequest = (header: { [key: string]: string }) =>
    ({
        headers: {
            ...header,

            get(header: string): string {
                return this[header];
            }
        }
    }) as any;

describe('server/middleware/shared', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should run middleware and resolve', async () => {
        // setup
        const middleware = vi.fn().mockImplementation((req, resp, callback) => callback(true));
        const request = { test: 'request' } as any;
        const response = { test: 'response' } as any;

        // exercise && verify
        expect(await runMiddleware(request, response, middleware)).toEqual(true);

        expect(middleware.mock.lastCall?.[0]).toEqual(request);
        expect(middleware.mock.lastCall?.[1]).toEqual(response);
        expect(middleware.mock.lastCall?.[2]).toBeTypeOf('function');
    });

    it('should run middleware and reject', async () => {
        // setup
        const middleware = vi.fn().mockImplementation((req, resp, callback) => callback(Error()));
        const request = { test: 'request' } as any;
        const response = { test: 'response' } as any;

        // exercise && verify
        await expect(runMiddleware(request, response, middleware)).rejects.toThrowError(Error);

        expect(middleware.mock.lastCall?.[0]).toEqual(request);
        expect(middleware.mock.lastCall?.[1]).toEqual(response);
        expect(middleware.mock.lastCall?.[2]).toBeTypeOf('function');
    });

    it('should get the request ip', () => {
        // exercise && verify
        expect(getIP({ ip: 'ip' } as any)).toEqual('ip');
        expect(
            getIP(
                buildRequest({
                    'x-forwarded-for': 'forwarded'
                })
            )
        ).toEqual('forwarded');
        expect(
            getIP(
                buildRequest({
                    'x-real-ip': 'real'
                })
            )
        ).toEqual('real');
    });

    it('should evaluate if a request is from vercel in prod', () => {
        // setup
        vi.stubEnv('VERCEL_ENV', 'production');
        vi.stubEnv('VERCEL_URL', 'deployment-url');

        // exercise && verify
        expect(
            isFromVercel(
                buildRequest({
                    'x-vercel-deployment-url': process.env.VERCEL_URL as string
                })
            )
        ).toEqual(true);
        expect(
            isFromVercel(
                buildRequest({
                    'x-vercel-deployment-url': 'wrong value'
                })
            )
        ).toEqual(false);
        expect(isFromVercel(buildRequest({}))).toEqual(false);

        // cleanup
        vi.unstubAllEnvs();
    });

    it('should simulate vercel env when in dev environment', () => {
        // exercise && verify
        expect(isFromVercel(buildRequest({}))).toEqual(true);
    });
});
