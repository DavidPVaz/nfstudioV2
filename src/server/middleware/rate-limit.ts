import type { NextRequest } from 'next/server';
import { isAdmin } from '@/server/middleware/shared';

interface RateLimitProps {
    keyGenerator: (request: NextRequest) => string;
    limit?: number;
    windowMs?: number;
}

export const RateLimit = ({ keyGenerator, limit = 5, windowMs = 60000 }: RateLimitProps) => {
    const map = new Map<string, { requestTimestamp: string; requestCount: number }>();

    const middleware = (request: NextRequest) => {
        if (isAdmin(request)) {
            return { success: true };
        }

        const key = keyGenerator(request);
        const user = map.get(key);
        const currentRequestTime = new Date().toISOString();
        const timeToReset = new Date(
            new Date(currentRequestTime).getTime() + windowMs
        ).toISOString();

        if (!user) {
            map.set(key, {
                requestTimestamp: currentRequestTime,
                requestCount: 1
            });

            return {
                limit,
                remaining: limit - 1,
                timeToReset,
                success: true
            };
        }

        // if record is found, calculate number of requests users has made within the last window
        const currentWindowStart = new Date(
            new Date(currentRequestTime).getTime() - windowMs
        ).toISOString();

        if (user.requestCount >= limit) {
            // keep incrementing and throttle in case of abuse?
            return {
                limit,
                remaining: 0,
                timeToReset,
                success: false,
                code: 429,
                message: 'Too many requests.'
            };
        }

        // if its still within current window, increment counter
        if (user.requestTimestamp > currentWindowStart) {
            return {
                limit,
                remaining: limit - ++user.requestCount,
                timeToReset,
                success: true
            };
        }

        // a new window has began, delete previous entry and setup a new one
        // this only happens when user requests again after window has reset - need to have a way of clearing user entry after a certain time interval
        map.set(key, {
            requestTimestamp: currentRequestTime,
            requestCount: 1
        });

        return {
            limit,
            remaining: limit - 1,
            timeToReset,
            success: true
        };
    };

    return middleware;
};

/*
 response.setHeader("X-RateLimit-Limit", info.limit.toString());
  response.setHeader("X-RateLimit-Remaining", info.remaining.toString());
  if (info.resetTime instanceof Date) {
    response.setHeader("Date", ( new Date()).toUTCString());
    response.setHeader(
        "X-RateLimit-Reset",
        Math.ceil(info.resetTime.getTime() / 1e3).toString()

*/
