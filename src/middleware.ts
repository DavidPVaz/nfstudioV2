import { NextResponse, type NextRequest } from 'next/server';
import { isAuthorized } from '@/server/middleware/shared';

export function middleware(req: NextRequest) {
    if (!isAuthorized(req)) {
        return new Response('Unauthorized', { status: 401 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)'
    ]
};
