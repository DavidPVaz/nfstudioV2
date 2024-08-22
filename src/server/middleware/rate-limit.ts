import type { NextApiRequest, NextApiResponse } from 'next';
import RateLimit, { type ValueDeterminingMiddleware } from 'express-rate-limit';

interface RateLimitProps {
    request: NextApiRequest;
    response: NextApiResponse;
    limit?: number;
    windowMs?: number;
}

type Middleware = (
    request: NextApiRequest,
    response: NextApiResponse,
    callback: (result: Error | boolean) => void
) => void;

export const getIP = (request: NextApiRequest) =>
    request.headers['x-forwarded-for'] ??
    request.headers['x-real-ip'] ??
    request.socket.remoteAddress;

/**
 * Executes a specific middleware and throws on error.
 *
 * @param {NextApiRequest} request - Nextjs request object
 * @param {NextApiResponse} response - Nextjs response object
 * @param {Middleware} middleware - the middleware function
 */
const runMiddleware = (
    request: NextApiRequest,
    response: NextApiResponse,
    middleware: Middleware
) =>
    new Promise((resolve, reject) =>
        middleware(request, response, result =>
            result instanceof Error ? reject(result) : resolve(result)
        )
    );

const map = new Map<string, Middleware>();

const getMiddleware = ({ limit, windowMs }: { limit: number; windowMs: number }) => {
    const key = `${limit}:${windowMs}`;

    return (map.get(key) ??
        map
            .set(
                `${limit}:${windowMs}`,
                RateLimit({
                    keyGenerator: getIP as ValueDeterminingMiddleware<string>,
                    windowMs,
                    max: limit
                }) as Middleware
            )
            .get(key))!;
};

/**
 * Executes rate limit middleware.
 *
 * @param {RateLimitProps} options
 * @param {RateLimitProps['request']} options.request - Nextjs request object
 * @param {RateLimitProps['response']} options.response - Nextjs response object
 * @param {RateLimitProps['limit']} [options.limit] - The maximum number of connections to allow during the `window` before rate limiting the client.
 * @param {RateLimitProps['windowMs']} [options.windowMs] - the time window in ms to evaluate the rate limiting
 */
export const rateLimit = ({ request, response, limit = 5, windowMs = 60000 }: RateLimitProps) =>
    runMiddleware(request, response, getMiddleware({ limit, windowMs }));
