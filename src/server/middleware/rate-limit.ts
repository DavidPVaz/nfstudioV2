import type { NextRequest } from 'next/server';
import { isAdmin } from '@/server/middleware/shared';

type RateLimitProps = {
    keyGenerator: (request: NextRequest) => string;
    limit?: number;
    windowMs?: number;
};

type Request = {
    timestamp: number;
    count: number;
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
    const requests = new Map<string, Request>();
    const timers = new Map<string, NodeJS.Timeout>();

    const get = (key: string) => {
        return requests.get(key);
    };

    const add = (key: string, request: Request) => {
        const currentTimeoutForRequest = timers.get(key);

        if (currentTimeoutForRequest) {
            clearTimeout(currentTimeoutForRequest);
        }

        requests.set(key, request);

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

    const middleware = (incomingRequest: NextRequest) => {
        if (isAdmin(incomingRequest)) {
            return { limited: false, headers: {} };
        }

        const key = keyGenerator(incomingRequest);
        const request = store.get(key);

        const currentRequestTime = new Date().getTime();
        const timeToReset = new Date(
            (request?.timestamp ?? currentRequestTime) + windowMs
        ).getTime();

        if (!request) {
            store.add(key, {
                timestamp: currentRequestTime,
                count: 1
            });

            return {
                limited: false,
                code: null,
                message: null,
                headers: getXRateLimitHeaders({
                    limit,
                    remaining: limit - 1,
                    reset: timeToReset
                })
            };
        }

        const currentWindowStart = new Date(currentRequestTime - windowMs).getTime();
        const isStillInCurrentWindow =
            request.timestamp > currentWindowStart && request.timestamp < timeToReset;

        if (isStillInCurrentWindow) {
            const hasReachedLimit = ++request.count > limit;

            return {
                limited: hasReachedLimit,
                code: hasReachedLimit ? 429 : null,
                message: hasReachedLimit ? 'Too many requests.' : null,
                headers: getXRateLimitHeaders({
                    limit,
                    remaining: hasReachedLimit ? 0 : limit - request.count,
                    reset: timeToReset
                })
            };
        }

        // Reaching here, the timer has failed to delete this request identifier from store when the window
        // ended after the `windowMs`. This means there is still a request identifier for this `key`.
        // A new window has began, add a new request identifier and clear previous timer.
        store.add(key, {
            timestamp: currentRequestTime,
            count: 1
        });

        return {
            limited: false,
            code: null,
            message: null,
            headers: getXRateLimitHeaders({
                limit,
                remaining: limit - 1,
                reset: new Date(currentRequestTime + windowMs).getTime()
            })
        };
    };

    return middleware;
};
