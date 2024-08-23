import { NextResponse, type NextRequest } from 'next/server';
import { isAuthorized, getIP } from '@/server/middleware/shared';
import { RateLimit } from './server/middleware/rate-limit';

const isApiEndpoint = (request: NextRequest) => request.nextUrl.pathname.startsWith('/api');
//const isImageLoaderEndpoint = (request: NextRequest) => request.nextUrl.pathname.startsWith('/api/image-loader');

const ImageLoaderLimiter = RateLimit({ keyGenerator: getIP, limit: 40, windowMs: 60000 });

export function middleware(request: NextRequest) {
    if (!isAuthorized(request)) {
        return new NextResponse(null, { status: 401 });
    }

    if (isApiEndpoint(request)) {
        const result = ImageLoaderLimiter(request);
        console.log('RESULT: ', result);
    }

    return NextResponse.next();
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
