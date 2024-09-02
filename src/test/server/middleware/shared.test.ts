/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { NextRequest } from 'next/server';
import { NextURL } from 'next/dist/server/web/next-url';
import { describe, expect, vi, afterEach, it } from 'vitest';
import {
    getIP,
    isFromVercel,
    isFromBrowser,
    isAdmin,
    isAuthorized
} from '@/server/middleware/shared';

const buildRequest = (
    header: Record<string, string>,
    nextUrl: NextURL = new NextURL('http://localhost:3000')
) =>
    ({
        nextUrl,
        headers: {
            ...header,

            get(header: string): string {
                return this[header];
            }
        }
    }) as NextRequest;

describe('server/middleware/shared', () => {
    afterEach(() => {
        vi.resetAllMocks();
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
        expect(getIP(buildRequest({}))).toEqual(undefined);
    });

    it('should evaluate if a request is from vercel', () => {
        // setup
        vi.stubEnv('VERCEL_ENV', 'production');
        vi.stubEnv('VERCEL_URL', 'deployment-url');

        // exercise && verify
        expect(
            isFromVercel(
                buildRequest({
                    'x-vercel-deployment-url': 'deployment-url'
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

        vi.stubEnv('VERCEL_ENV', 'development');
        expect(isFromVercel(buildRequest({}))).toEqual(true);

        // cleanup
        vi.unstubAllEnvs();
    });

    it('should evaluate if a request is from browser', () => {
        // exercise && verify
        expect(
            isFromBrowser(
                buildRequest({
                    'user-agent':
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
                })
            )
        ).toEqual(true);
        expect(
            isFromBrowser(
                buildRequest({
                    'user-agent': 'not a valid user agent'
                })
            )
        ).toEqual(false);
    });

    it('should evaluate if a request was made by Admin', () => {
        // setup
        vi.stubEnv('SECRET', 'super-secret');
        vi.stubEnv('CRON_SECRET', 'super-cron-secret');

        // exercise && verify
        expect(
            isAdmin(
                buildRequest({
                    authorization: 'Bearer super-secret'
                })
            )
        ).toEqual(true);
        expect(
            isAdmin(
                buildRequest({
                    authorization: 'Bearer super-cron-secret'
                })
            )
        ).toEqual(true);
        expect(
            isAdmin(buildRequest({}, new NextURL('http://localhost:3000?secret=super-secret')))
        ).toEqual(true);
        expect(
            isAdmin(
                buildRequest({
                    authorization: 'Bearer wrong-secret'
                })
            )
        ).toEqual(false);
        expect(
            isAdmin(
                buildRequest({
                    authorization: 'Bearer wrong-cron-secret'
                })
            )
        ).toEqual(false);
        expect(
            isAdmin(buildRequest({}, new NextURL('http://localhost:3000?secret=wrong-secret')))
        ).toEqual(false);

        // cleanup
        vi.unstubAllEnvs();
    });

    it('should evaluate if a request is authorized', () => {
        // setup
        vi.stubEnv('VERCEL_ENV', 'production');
        vi.stubEnv('VERCEL_URL', 'deployment-url');
        vi.stubEnv('SECRET', 'super-secret');
        vi.stubEnv('CRON_SECRET', 'super-cron-secret');

        // exercise && verify

        // valid Admin and not from vercel and invalid ua
        expect(
            isAuthorized(
                buildRequest({
                    authorization: 'Bearer super-secret',
                    'x-vercel-deployment-url': 'wrong value',
                    'user-agent': 'not a valid user agent'
                })
            )
        ).toEqual(true);
        expect(
            isAuthorized(
                buildRequest({
                    authorization: 'Bearer super-cron-secret',
                    'x-vercel-deployment-url': 'wrong value',
                    'user-agent': 'not a valid user agent'
                })
            )
        ).toEqual(true);
        expect(
            isAuthorized(
                buildRequest(
                    {
                        'x-vercel-deployment-url': 'wrong value',
                        'user-agent': 'not a valid user agent'
                    },
                    new NextURL('http://localhost:3000?secret=super-secret')
                )
            )
        ).toEqual(true);
        // invalid Admin and not from vercel and invalid ua
        expect(
            isAuthorized(
                buildRequest({
                    authorization: 'Bearer super-wrong-secret',
                    'x-vercel-deployment-url': 'wrong value',
                    'user-agent': 'not a valid user agent'
                })
            )
        ).toEqual(false);
        expect(
            isAuthorized(
                buildRequest({
                    authorization: 'Bearer super-wrong-cron-secret',
                    'x-vercel-deployment-url': 'wrong value',
                    'user-agent': 'not a valid user agent'
                })
            )
        ).toEqual(false);
        expect(
            isAuthorized(
                buildRequest(
                    {
                        'x-vercel-deployment-url': 'wrong value',
                        'user-agent': 'not a valid user agent'
                    },
                    new NextURL('http://localhost:3000?secret=super-wrong-secret')
                )
            )
        ).toEqual(false);
        // invalid Admin and from vercel and valid ua
        expect(
            isAuthorized(
                buildRequest({
                    'x-vercel-deployment-url': 'deployment-url',
                    'user-agent':
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
                })
            )
        ).toEqual(true);
        // invalid Admin and not from vercel and valid ua
        expect(
            isAuthorized(
                buildRequest({
                    'x-vercel-deployment-url': 'wrong value',
                    'user-agent':
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
                })
            )
        ).toEqual(false);
        // invalid Admin and from vercel and invalid ua
        expect(
            isAuthorized(
                buildRequest({
                    'x-vercel-deployment-url': 'deployment-url',
                    'user-agent': 'not a valid user agent'
                })
            )
        ).toEqual(false);
        // invalid Admin and not from vercel and invalid ua
        expect(
            isAuthorized(
                buildRequest({
                    'x-vercel-deployment-url': 'wrong value',
                    'user-agent': 'not a valid user agent'
                })
            )
        ).toEqual(false);

        // cleanup
        vi.unstubAllEnvs();
    });
});
