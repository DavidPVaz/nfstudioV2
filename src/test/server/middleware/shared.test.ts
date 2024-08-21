/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { describe, expect, vi, afterEach, it } from 'vitest';
import { runMiddleware, getIP, isFromVercel } from '@/server/middleware/shared';
import type { NextRequest, NextResponse } from 'next/server';

const buildRequest = (header: Record<string, string>) =>
    ({
        headers: {
            ...header,

            get(header: string): string {
                return this[header];
            }
        }
    }) as NextRequest;

describe('server/middleware/shared', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should run middleware and resolve', async () => {
        // setup
        const middleware = vi.fn().mockImplementation((req, resp, callback) => callback(true));
        const request = { ip: 'request' } as NextRequest;
        const response = { headers: {} } as NextResponse;

        // exercise && verify
        expect(await runMiddleware(request, response, middleware)).toEqual(true);

        expect(middleware.mock.lastCall?.[0]).toEqual(request);
        expect(middleware.mock.lastCall?.[1]).toEqual(response);
        expect(middleware.mock.lastCall?.[2]).toBeTypeOf('function');
    });

    it('should run middleware and reject', async () => {
        // setup
        const middleware = vi.fn().mockImplementation((req, resp, callback) => callback(Error()));
        const request = { ip: 'request' } as NextRequest;
        const response = { headers: {} } as NextResponse;

        // exercise && verify
        await expect(runMiddleware(request, response, middleware)).rejects.toThrowError(Error);

        expect(middleware.mock.lastCall?.[0]).toEqual(request);
        expect(middleware.mock.lastCall?.[1]).toEqual(response);
        expect(middleware.mock.lastCall?.[2]).toBeTypeOf('function');
    });

    it('should get the request ip', () => {
        // exercise && verify
        expect(getIP({ ip: 'ip' } as NextRequest)).toEqual('ip');
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
                    'x-vercel-deployment-url': process.env.VERCEL_URL!
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
