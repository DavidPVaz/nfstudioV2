import type { NextRequest } from 'next/server';
import { isAdmin } from '@/server/middleware/shared';

interface RateLimitProps {
    keyGenerator: (request: NextRequest) => string;
    limit?: number;
    windowMs?: number;
}

type RequestIdentifier = {
    requestTimestamp: number;
    requestCount: number;
};

const getXRateLimitHeaders = ({
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

const Store = (windowMs: number) => {
    const requests = new Map<string, RequestIdentifier>();
    const timers = new Map<string, NodeJS.Timeout>();

    const get = (key: string) => {
        return requests.get(key);
    };

    const add = (key: string, requestIdentifier: RequestIdentifier) => {
        const currentTimeoutForRequest = timers.get(key);

        if (currentTimeoutForRequest) {
            clearTimeout(currentTimeoutForRequest);
        }

        requests.set(key, requestIdentifier);

        const timerID = setTimeout(() => {
            requests.delete(key);
            timers.delete(key);
        }, windowMs);

        timers.set(key, timerID);
    };

    return { get, add };
};

export const RateLimit = ({ keyGenerator, limit = 5, windowMs = 60000 }: RateLimitProps) => {
    const store = Store(windowMs);

    const middleware = (request: NextRequest) => {
        if (isAdmin(request)) {
            return { limited: false, headers: {} };
        }

        const key = keyGenerator(request);
        const requestIdentifier = store.get(key);

        const currentRequestTime = new Date().getTime();
        const timeToReset = new Date(
            (requestIdentifier?.requestTimestamp ?? currentRequestTime) + windowMs
        ).getTime();

        if (!requestIdentifier) {
            store.add(key, {
                requestTimestamp: currentRequestTime,
                requestCount: 1
            });

            return {
                limited: false,
                headers: getXRateLimitHeaders({
                    limit,
                    remaining: limit - 1,
                    reset: timeToReset
                })
            };
        }

        const currentWindowStart = new Date(currentRequestTime - windowMs).getTime();
        const isStillInCurrentWindow =
            requestIdentifier.requestTimestamp > currentWindowStart &&
            requestIdentifier.requestTimestamp < timeToReset;

        if (isStillInCurrentWindow) {
            const hasReachedLimit = requestIdentifier.requestCount >= limit;

            return {
                limited: hasReachedLimit,
                code: hasReachedLimit ? 429 : null,
                message: hasReachedLimit ? 'Too many requests.' : null,
                headers: getXRateLimitHeaders({
                    limit,
                    remaining: hasReachedLimit ? 0 : limit - ++requestIdentifier.requestCount,
                    reset: timeToReset
                })
            };
        }

        // Reaching here, the timer has failed to delete this request identifier from store when the window
        // ended after the `windowMs`. This means there is still a request identifier for this `key`.
        // A new window has began, add a new request identifier and clear previous timer.
        store.add(key, {
            requestTimestamp: currentRequestTime,
            requestCount: 1
        });

        return {
            limited: false,
            headers: getXRateLimitHeaders({
                limit,
                remaining: limit - 1,
                reset: timeToReset
            })
        };
    };

    return middleware;
};
