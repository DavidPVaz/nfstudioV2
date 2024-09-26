import type { NextApiRequest, NextApiResponse } from 'next';
import * as v from 'valibot';
import { preview } from '@/server/service/nft-converter';
import { captureException } from '@sentry/nextjs';
import { getOptionsMinMaxAvailableDimensions } from '@/enums';

const { width, height } = getOptionsMinMaxAvailableDimensions();

const itCannotBeConvertedToNumber = (input: string) => Number.isNaN(Number.parseInt(input));
const transformStringValidation = (input: string) => {
    if (itCannotBeConvertedToNumber(input)) {
        return input;
    }

    throw Error();
};
const isBoolean = (input: string) => input === 'true' || input === 'false';
const transformBooleanValidation = (input: string) => {
    if (isBoolean(input)) {
        return input === 'true';
    }

    throw Error();
};

const QueryParamsSchema = v.object({
    src: v.pipe(v.string(), v.transform(transformStringValidation)),
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
    atRight: v.pipe(v.string(), v.transform(transformBooleanValidation), v.boolean()),
    coverStyle: v.pipe(v.string(), v.transform(transformBooleanValidation), v.boolean()),
    mobile: v.pipe(v.string(), v.transform(transformBooleanValidation), v.boolean()),
    collection: v.pipe(v.string(), v.regex(/^[a-zA-Z]+(?:_[a-zA-Z]+)*$/)),
    logoSrc: v.optional(v.pipe(v.string(), v.transform(transformStringValidation))),
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

        return response.status(500).send('An error occurred while creating the preview.');
    }
}
