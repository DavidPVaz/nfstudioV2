import type { NextApiRequest, NextApiResponse } from 'next';
import * as v from 'valibot';
import { optimize } from '@/server/service/image-loader';

const QueryParamsSchema = v.object({
    src: v.string(),
    width: v.optional(
        v.pipe(v.string(), v.transform(Number), v.number(), v.minValue(50), v.maxValue(1000))
    ),
    quality: v.optional(
        v.pipe(v.string(), v.transform(Number), v.number(), v.minValue(10), v.maxValue(100))
    ),
    maxAge: v.optional(
        v.pipe(v.string(), v.transform(Number), v.number(), v.minValue(0), v.maxValue(31536000))
    ),
    sMaxAge: v.optional(
        v.pipe(v.string(), v.transform(Number), v.number(), v.minValue(0), v.maxValue(31536000))
    )
});

/**
 * API endpoint to perform image optimization.
 *
 * @param {NextApiRequest} request - Nextjs request
 * @param {NextApiResponse} response - Nextjs response
 */
export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    let query: v.InferOutput<typeof QueryParamsSchema>;

    try {
        query = v.parse(QueryParamsSchema, request.query);
    } catch {
        return response.status(400).send('Bad request');
    }

    const { maxAge = 31536000, sMaxAge = 31536000 } = query;

    try {
        const optimized = await optimize(query);

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
