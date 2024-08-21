import type { NextRequest, NextResponse } from 'next/server';

type Middleware = (
    request: NextRequest,
    response: NextResponse,
    callback: (result: Error | boolean) => void
) => void;

/**
 * Executes a specific middleware and throws on error.
 *
 * @param {NextRequest} request - Nextjs request object
 * @param {NextResponse} response - Nextjs response object
 * @param {Middleware} middleware - the middleware function
 */
export const runMiddleware = (
    request: NextRequest,
    response: NextResponse,
    middleware: Middleware
) =>
    new Promise((resolve, reject) =>
        middleware(request, response, result =>
            result instanceof Error ? reject(result) : resolve(result)
        )
    );

export const getIP = (request: NextRequest) =>
    request.ip ?? request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip');

export const isFromVercel = (request: NextRequest) =>
    process.env.VERCEL_ENV === 'development' ||
    request.headers.get('x-vercel-deployment-url') === process.env.VERCEL_URL;
