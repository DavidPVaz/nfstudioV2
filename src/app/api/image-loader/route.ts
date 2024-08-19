import { type NextRequest, NextResponse } from 'next/server';
import { optimize } from '@/server/service/image-loader';

export async function GET(request: NextRequest) {
    // TODO: authorization + rate limit middleware + search params validation with zod
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const { src, width, quality, maxAge, sMaxAge } = searchParams;

    try {
        const optimized = await optimize({ src, width, quality, ttl: sMaxAge });

        return new NextResponse(optimized, {
            status: 200,
            headers: {
                // TODO: verify this approach - check if works after deployed, otherwise need to move to pages router api
                // Control the Edge Cache
                'Cache-Control': `max-age=${maxAge ?? 31536000}, s-maxage=${sMaxAge ?? 31536000}, public, stale-while-revalidate=60`,
                'Content-Type': 'image/webp'
            }
        });
    } catch (error) {
        return new NextResponse('An error occurred while optimizing the image.', {
            status: 500
        });
    }
}
