import type { NextApiRequest, NextApiResponse } from 'next';
import * as v from 'valibot';
import { preview } from '@/server/service/nft-converter';
import { captureException } from '@sentry/nextjs';
import { getOptionsMinMaxConfig } from '@/lib/utils';

const { width, height } = getOptionsMinMaxConfig();

const TRUSTED_CONTENT_HOSTS = /^https:\/\/(uploader\.irys\.xyz|gateway\.irys\.xyz)\/[a-zA-Z0-9_-]+$/;

const QueryParamsSchema = v.object({
    src: v.pipe(
        v.string(),
        v.regex(
            new RegExp(
                `(${TRUSTED_CONTENT_HOSTS.source})` +
                `|(^https:\\/\\/.*(\\.png|ext=png).*$)` +
                `|(^(?!.*:\\/\\/).*?-logo.*\\.png$)` +
                `|(^(?!.*:\\/\\/).*(\\/[0-9a-zA-Z]+(?:_[0-9a-zA-Z]+)*)\\.webp$)`
            )
        )
    ),
    width: v.pipe(
        v.string(),
        v.transform(Number),
        v.number(),
        v.minValue(width.min),
        v.maxValue(width.max)
    ),
    height: v.pipe(
        v.string(),
        v.transform(Number),
        v.number(),
        v.minValue(height.min),
        v.maxValue(height.max)
    ),
    atRight: v.pipe(
        v.string(),
        v.regex(/^(true|false)$/),
        v.transform(input => input === 'true'),
        v.boolean()
    ),
    coverStyle: v.pipe(
        v.string(),
        v.regex(/^(true|false)$/),
        v.transform(input => input === 'true'),
        v.boolean()
    ),
    mobile: v.pipe(
        v.string(),
        v.regex(/^(true|false)$/),
        v.transform(input => input === 'true'),
        v.boolean()
    ),
    collection: v.pipe(v.string(), v.regex(/^[a-zA-Z]+(?:_[a-zA-Z]+)*$/)),
    logoSrc: v.optional(v.pipe(v.string(), v.regex(/^(?!.*:\/\/).*?-logo.*\.png$/))),
    maxAge: v.optional(
        v.pipe(v.string(), v.transform(Number), v.number(), v.minValue(0), v.maxValue(31536000))
    ),
    sMaxAge: v.optional(
        v.pipe(v.string(), v.transform(Number), v.number(), v.minValue(0), v.maxValue(31536000))
    )
});

/**
 * API endpoint to create a wallpaper/banner preview image.
 *
 * @param request - Nextjs request
 * @param response - Nextjs response
 */
export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    let query: v.InferOutput<typeof QueryParamsSchema>;

    try {
        query = v.parse(QueryParamsSchema, request.query);
    } catch {
        return response.status(400).send('Bad request.');
    }

    const { maxAge = 31536000, sMaxAge = 31536000, ...previewOptions } = query;

    try {
        const previewImage = await preview(previewOptions);
        response.setHeader(
            'Cache-Control',
            `max-age=${maxAge}, s-maxage=${sMaxAge}, public, stale-while-revalidate=60`
        );
        response.setHeader('Content-Type', 'image/webp');

        return response.status(200).send(previewImage);
    } catch (error) {
        captureException(error);

        return response
            .status(500)
            .send('An unexpected error occurred while creating the preview.');
    }
}
