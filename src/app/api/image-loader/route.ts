import { type NextRequest, NextResponse } from 'next/server';
import { optimize } from '@/server/service/image-loader';

export async function GET(request: NextRequest) {
    // TODO: authorization + rate limit middleware + search params validation with zod
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const { src, width, quality, maxAge = 31536000, sMaxAge = 31536000 } = searchParams;

    try {
        const optimized = await optimize({ src, width, quality });

        return new NextResponse(optimized, {
            status: 200,
            headers: {
                // TODO: verify this approach vs fetch revalidate option
                'Cache-Control': `max-age=${maxAge}, s-maxage=${sMaxAge}, public, stale-while-revalidate=60`,
                'Content-Type': 'image/webp'
            }
        });
    } catch (error) {
        //await captureException(error);

        return new NextResponse('An error occurred while optimizing the image.', {
            status: 500
        });
    }
}
