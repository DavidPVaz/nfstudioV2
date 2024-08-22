import { NextResponse, type NextRequest } from 'next/server';
import { isAuthorized } from '@/server/middleware/shared';

export function middleware(request: NextRequest) {
    if (!isAuthorized(request)) {
        return new NextResponse(null, { status: 401 });
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
