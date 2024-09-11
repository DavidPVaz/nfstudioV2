import type { NextApiRequest, NextApiResponse } from 'next';
import * as v from 'valibot';
import { queryMetadata } from '@/server/service/mongo';
import { captureException } from '@sentry/nextjs';

const QueryParamsSchema = v.object({
    collection: v.pipe(v.string(), v.regex(/^[a-zA-Z]+(?:_[a-zA-Z]+)*$/)),
    ids: v.pipe(
        v.string(),
        v.regex(/^(?:[0-9]{1,5})(?:,(?:[0-9]{1,5})){0,19}$/),
        v.transform(ids => ids.split(',').map(Number))
    )
});

/**
 * API endpoint to perform query for NFT metadata.
 *
 * @param {NextApiRequest} request - Nextjs request
 * @param {NextApiResponse} response - Nextjs response
 */
export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    let query: v.InferOutput<typeof QueryParamsSchema>;

    try {
        query = v.parse(QueryParamsSchema, request.query);
    } catch {
        return response.status(400).send('Bad request.');
    }

    try {
        const metadata = await queryMetadata(query);

        response.setHeader('Cache-Control', 'max-age=0, s-maxage=31536000, public');

        return response.status(200).json(metadata);
    } catch (error) {
        captureException(error);

        return response.status(500).send('An error occurred while fetching metadata.');
    }
}
