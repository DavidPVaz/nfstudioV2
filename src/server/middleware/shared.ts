import { type NextRequest, type NextResponse, userAgent } from 'next/server';

export type Middleware = (
    request: NextRequest,
    response: NextResponse,
    callback: (result: Error | boolean) => void
) => void;

/**
 * Executes a specific middleware and throws on error.
 *
 * @param {NextApiRequest} request - Nextjs request object
 * @param {NextApiResponse} response - Nextjs response object
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

export const isFromBrowser = (request: NextRequest) => {
    const { browser, engine, os, device } = userAgent(request);

    return (
        !!browser.name &&
        !!browser.version &&
        !!engine.name &&
        !!engine.version &&
        !!os.name &&
        !!os.version &&
        !!device.vendor &&
        !!device.model
    );
};

export const isAdmin = (request: NextRequest) => {
    const authHeader = request.headers.get('authorization');
    const secretSearchParam = request.nextUrl.searchParams.get('secret');

    return (
        authHeader === `Bearer ${process.env.SECRET}` ||
        authHeader === `Bearer ${process.env.CRON_SECRET}` ||
        secretSearchParam === process.env.SECRET
    );
};

export const isAuthorized = (request: NextRequest) =>
    isAdmin(request) || (isFromVercel(request) && isFromBrowser(request));
