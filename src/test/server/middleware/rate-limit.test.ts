import type { NextRequest } from 'next/server';
import { describe, expect, vi, afterEach, it } from 'vitest';
import { RateLimit } from '@/server/middleware/rate-limit';

const { isAdminMock } = vi.hoisted(() => ({
    isAdminMock: vi.fn().mockImplementation(() => false)
}));

vi.mock('@/server/middleware/shared', () => ({
    isAdmin: isAdminMock
}));

const getExpectedXRateLimitHeaders = ({
    limit,
    remaining,
    reset
}: {
    limit: number;
    remaining: number;
    reset: number;
}) => ({
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': reset.toString()
});

describe('server/middleware/rate-limit', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should not rate limit an admin', () => {
        // setup
        const request = {} as NextRequest;
        const Limiter = RateLimit({ keyGenerator: () => '' });
        isAdminMock.mockImplementationOnce(() => true);

        // exercise
        const result = Limiter(request);

        // verify
        expect(result).toEqual({ limited: false, headers: {} });
        expect(isAdminMock).toHaveBeenNthCalledWith(1, request);
    });

    it('should rate limit and auto clear the store after the window', () => {
        // setup
        vi.useFakeTimers();
        const limit = 3;
        const windowMs = 100;
        const request = {} as NextRequest;
        const Limiter = RateLimit({ keyGenerator: () => 'key', limit, windowMs });
        const date = new Date().getTime();
        const expectedReset = new Date(date + windowMs).getTime();
        const expectedSecondReset = new Date(expectedReset + windowMs).getTime();

        vi.setSystemTime(date);

        // exercise && verify
        expect(Limiter(request)).toEqual({
            limited: false,
            code: null,
            message: null,
            headers: getExpectedXRateLimitHeaders({ limit, remaining: 2, reset: expectedReset })
        });
        expect(Limiter(request)).toEqual({
            limited: false,
            code: null,
            message: null,
            headers: getExpectedXRateLimitHeaders({ limit, remaining: 1, reset: expectedReset })
        });
        expect(Limiter(request)).toEqual({
            limited: false,
            code: null,
            message: null,
            headers: getExpectedXRateLimitHeaders({ limit, remaining: 0, reset: expectedReset })
        });
        expect(Limiter(request)).toEqual({
            limited: true,
            code: 429,
            message: 'Too many requests.',
            headers: getExpectedXRateLimitHeaders({ limit, remaining: 0, reset: expectedReset })
        });

        vi.runAllTimers();

        expect(Limiter(request)).toEqual({
            limited: false,
            code: null,
            message: null,
            headers: getExpectedXRateLimitHeaders({
                limit,
                remaining: 2,
                reset: expectedSecondReset
            })
        });
        expect(Limiter(request)).toEqual({
            limited: false,
            code: null,
            message: null,
            headers: getExpectedXRateLimitHeaders({
                limit,
                remaining: 1,
                reset: expectedSecondReset
            })
        });

        // cleanup
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    it('should rate limit and force clear the store due to a new window start and previous timeout failed to execute on time', () => {
        // setup
        vi.useFakeTimers();
        const limit = 3;
        const windowMs = 100;
        const request = {} as NextRequest;
        const Limiter = RateLimit({ keyGenerator: () => 'key', limit, windowMs });
        const date = new Date().getTime();
        const expectedReset = new Date(date + windowMs).getTime();
        const expectedSecondReset = new Date(expectedReset + windowMs).getTime();

        vi.setSystemTime(date);

        // exercise && verify
        expect(Limiter(request)).toEqual({
            limited: false,
            code: null,
            message: null,
            headers: getExpectedXRateLimitHeaders({ limit, remaining: 2, reset: expectedReset })
        });
        expect(Limiter(request)).toEqual({
            limited: false,
            code: null,
            message: null,
            headers: getExpectedXRateLimitHeaders({ limit, remaining: 1, reset: expectedReset })
        });
        expect(Limiter(request)).toEqual({
            limited: false,
            code: null,
            message: null,
            headers: getExpectedXRateLimitHeaders({ limit, remaining: 0, reset: expectedReset })
        });
        expect(Limiter(request)).toEqual({
            limited: true,
            code: 429,
            message: 'Too many requests.',
            headers: getExpectedXRateLimitHeaders({ limit, remaining: 0, reset: expectedReset })
        });

        vi.setSystemTime(expectedReset);

        expect(Limiter(request)).toEqual({
            limited: false,
            code: null,
            message: null,
            headers: getExpectedXRateLimitHeaders({
                limit,
                remaining: 2,
                reset: expectedSecondReset
            })
        });
        expect(Limiter(request)).toEqual({
            limited: false,
            code: null,
            message: null,
            headers: getExpectedXRateLimitHeaders({
                limit,
                remaining: 1,
                reset: expectedSecondReset
            })
        });

        // cleanup
        vi.clearAllTimers();
        vi.useRealTimers();
    });
});
