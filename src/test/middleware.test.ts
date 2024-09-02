/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { describe, expect, vi, afterEach, it } from 'vitest';
import type { NextRequest } from 'next/server';
import { middleware } from '@/middleware';

const {
    NextResponseMock,
    isAuthorizedMock,
    getIPMock,
    RateLimitMock,
    imageLoaderLimiterMock,
    apiLimiterMock
} = vi.hoisted(() => ({
    NextResponseMock: class {
        static next = vi.fn();
        static args: unknown[];

        constructor(...args: unknown[]) {
            NextResponseMock.args = args;
        }
    },
    isAuthorizedMock: vi.fn(),
    getIPMock: vi.fn(),
    RateLimitMock: vi
        .fn()
        .mockImplementationOnce(() => imageLoaderLimiterMock)
        .mockImplementationOnce(() => apiLimiterMock),
    imageLoaderLimiterMock: vi.fn(),
    apiLimiterMock: vi.fn()
}));

vi.mock('@/server/middleware/shared', () => ({
    isAuthorized: isAuthorizedMock,
    getIP: getIPMock
}));

vi.mock('@/server/middleware/rate-limit', () => ({
    RateLimit: RateLimitMock
}));

vi.mock('next/server', async importOriginal => {
    const actual: object = await importOriginal();
    return {
        ...actual,
        NextResponse: NextResponseMock
    };
});

describe('middleware', () => {
    afterEach(() => {
        vi.resetAllMocks();
        NextResponseMock.args = undefined;
    });

    it('should allow the request to proceed', () => {
        // setup
        const request = { nextUrl: { pathname: 'some url' } } as NextRequest;
        isAuthorizedMock.mockImplementationOnce(() => true);
        NextResponseMock.next.mockImplementationOnce(() => 'response');

        // exercise
        const result = middleware(request);

        // verify
        expect(result).toEqual('response');
        expect(isAuthorizedMock).toHaveBeenNthCalledWith(1, request);
        expect(NextResponseMock.args).not.toBeDefined();
        expect(NextResponseMock.next).toHaveBeenNthCalledWith(1);

        expect(RateLimitMock).toHaveBeenCalledWith({
            keyGenerator: getIPMock,
            limit: 50,
            windowMs: 60000
        });
        expect(RateLimitMock).toHaveBeenCalledWith({
            keyGenerator: getIPMock,
            limit: 5,
            windowMs: 60000
        });
    });

    it('should not authorize request the request', () => {
        // setup
        const request = {} as NextRequest;
        isAuthorizedMock.mockImplementationOnce(() => false);

        // exercise
        const result = middleware(request);

        // verify
        expect(result).toBeInstanceOf(NextResponseMock);
        expect(isAuthorizedMock).toHaveBeenNthCalledWith(1, request);
        expect(NextResponseMock.args).toEqual([null, { status: 401 }]);
        expect(NextResponseMock.next).not.toHaveBeenCalled();
    });

    it('should rate limit an api request and proceed by setting headers', () => {
        // setup
        const request = { nextUrl: { pathname: '/api' } } as NextRequest;
        const limiterResult = {
            limited: false,
            message: null,
            code: null,
            headers: { header1: 'value' }
        };
        const response = { headers: new Headers() };
        imageLoaderLimiterMock.mockImplementationOnce(() => null);
        apiLimiterMock.mockImplementationOnce(() => limiterResult);
        isAuthorizedMock.mockImplementationOnce(() => true);
        NextResponseMock.next.mockImplementationOnce(() => response);

        // exercise
        const result = middleware(request);

        // verify
        expect(result).toEqual(response);
        Object.entries(limiterResult.headers).forEach(([header, value]) =>
            expect(result.headers.get(header)).toEqual(value)
        );
        expect(isAuthorizedMock).toHaveBeenNthCalledWith(1, request);
        expect(NextResponseMock.args).not.toBeDefined();
        expect(NextResponseMock.next).toHaveBeenNthCalledWith(1);
        expect(apiLimiterMock).toHaveBeenNthCalledWith(1, request);
        expect(imageLoaderLimiterMock).not.toHaveBeenCalled();
    });

    it('should rate limit an api request and not proceed by sending new response', () => {
        // setup
        const request = { nextUrl: { pathname: '/api/image-loader' } } as NextRequest;
        const limiterResult = {
            limited: true,
            message: 'message',
            code: 'code',
            headers: { header1: 'value' }
        };
        imageLoaderLimiterMock.mockImplementationOnce(() => limiterResult);
        apiLimiterMock.mockImplementationOnce(() => null);
        isAuthorizedMock.mockImplementationOnce(() => true);

        // exercise
        const result = middleware(request);

        // verify
        expect(result).toBeInstanceOf(NextResponseMock);
        expect(isAuthorizedMock).toHaveBeenNthCalledWith(1, request);
        expect(NextResponseMock.next).toHaveBeenNthCalledWith(1);
        expect(imageLoaderLimiterMock).toHaveBeenNthCalledWith(1, request);
        expect(apiLimiterMock).not.toHaveBeenCalled();
        expect(NextResponseMock.args).toEqual([
            limiterResult.message,
            { status: limiterResult.code, headers: new Headers(limiterResult.headers) }
        ]);
    });
});
