import type { NextApiRequest, NextApiResponse } from 'next';
import * as v from 'valibot';
import { order } from '@/server/service/nft-converter';
import { captureException } from '@sentry/nextjs';
import { getOptionsMinMaxConfig } from '@/lib/utils';

const { width, height, dpi } = getOptionsMinMaxConfig();

const BodySchema = v.object({
    src: v.pipe(v.string(), v.regex(/^https:\/\/.*(\.png|ext=png).*$/)),
    width: v.pipe(v.number(), v.minValue(width.min), v.maxValue(width.max)),
    height: v.pipe(v.number(), v.minValue(height.min), v.maxValue(height.max)),
    dpi: v.pipe(v.number(), v.minValue(dpi.min), v.maxValue(dpi.max)),
    atRight: v.boolean(),
    coverStyle: v.boolean(),
    mobile: v.boolean(),
    collection: v.pipe(v.string(), v.regex(/^[a-zA-Z]+(?:_[a-zA-Z]+)*$/)),
    logoSrc: v.optional(v.pipe(v.string(), v.regex(/^(?!.*:\/\/).*?-logo.*\.png$/))),
    statusToken: v.string(), // TODO: see if it can be narrowed
    transactionSignature: v.string() // TODO: see if it can be narrowed
});

/**
 * API endpoint to order the client's wallpaper/banner after a successful payment.
 *
 * @param request - Nextjs request
 * @param response - Nextjs response
 */
export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    let body: v.InferOutput<typeof BodySchema>;

    try {
        body = v.parse(BodySchema, request.body);
    } catch {
        return response.status(400).send('Bad request.');
    }

    const { statusToken, transactionSignature, ...orderOptions } = body;

    // TODO: logic to fetch and validate blockchain transaction

    try {
        const buffer = await order(orderOptions);
        response.setHeader('Content-Type', 'application/octet-stream');

        return response.status(201).send(buffer);
    } catch (error) {
        captureException(error);

        return response.status(500).send('An unexpected error occurred while creating the image.');
    }
}
