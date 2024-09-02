import { NextResponse, type NextRequest } from 'next/server';
import { isAuthorized, getIP } from '@/server/middleware/shared';
import { RateLimit } from './server/middleware/rate-limit';

const isApiEndpoint = (request: NextRequest) => request.nextUrl.pathname.startsWith('/api');
const isImageLoaderEndpoint = (request: NextRequest) =>
    request.nextUrl.pathname.startsWith('/api/image-loader');

const ImageLoaderLimiter = RateLimit({ keyGenerator: getIP, limit: 50, windowMs: 60000 });
const ApiLimiter = RateLimit({ keyGenerator: getIP, limit: 5, windowMs: 60000 });

export function middleware(request: NextRequest) {
    if (!isAuthorized(request)) {
        return new NextResponse(null, { status: 401 });
    }

    const response = NextResponse.next();

    if (isApiEndpoint(request)) {
        const Limiter = isImageLoaderEndpoint(request) ? ImageLoaderLimiter : ApiLimiter;
        const { limited, message, code, headers } = Limiter(request);

        if (limited) {
            return new NextResponse(message, {
                status: code!,
                headers: new Headers(headers)
            });
        }

        Object.entries(headers).forEach(([header, value]) => response.headers.set(header, value));
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        {
            source: '/((?!_next/static|favicon.ico|sitemap.xml|robots.txt).*)'
        }
    ]
};
