import { optimize } from '@/server/service/image-loader';
import type { NextApiRequest, NextApiResponse } from 'next';
//import { userAgent } from 'next/server';
//console.log(userAgent({ headers: new Headers(headers as HeadersInit) }).browser);

/**
 * API endpoint to perform image optimization.
 *
 * @param {NextApiRequest} request - Nextjs request
 * @param {NextApiResponse} response - Nextjs response
 */
export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    // TODO: authorization middleware (referer && browser call && isFromVercel || isAdmin) in here or middleware ? + rate limit middleware + params validation with zod
    const {
        query: { src, width, quality, maxAge = 31536000, sMaxAge = 31536000 }
    } = request;

    try {
        const optimized = await optimize({ src, width, quality });

        response.setHeader(
            'Cache-Control',
            `max-age=${maxAge}, s-maxage=${sMaxAge}, public, stale-while-revalidate=60`
        );
        response.setHeader('Content-Type', 'image/webp');

        return response.status(200).send(optimized);
    } catch (error) {
        return response.status(500).send('An error occurred while optimizing the image.');
    }
}
