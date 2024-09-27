import { type NextRequest, userAgent } from 'next/server';

export const getIP = (request: NextRequest) =>
    request.ip! ?? request.headers.get('x-forwarded-for')! ?? request.headers.get('x-real-ip')!;

export const isFromVercel = (request: NextRequest) =>
    process.env.VERCEL_ENV === 'development' ||
    request.headers.get('x-vercel-deployment-url') === process.env.VERCEL_URL;

export const isValidOrigin = (request: NextRequest) =>
    process.env.VERCEL_ENV === 'development' ||
    !!request.headers.get('origin')?.includes(process.env.ORIGIN!);

export const isFromBrowser = (request: NextRequest) => {
    const { browser } = userAgent(request);

    return !!browser.name && !!browser.version;
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
    isAdmin(request) || (isValidOrigin(request) && isFromVercel(request) && isFromBrowser(request));
