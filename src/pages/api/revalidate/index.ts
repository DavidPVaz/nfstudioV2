import type { NextApiRequest, NextApiResponse } from 'next';
import * as v from 'valibot';
import { captureException } from '@sentry/nextjs';
import { PAGES } from '@/enums';

const possiblePaths = new RegExp(
    `^(${Object.values(PAGES)
        .map(page =>
            page === PAGES.COLLECTIONS
                ? '/collections(?:/[a-zA-Z]+(?:_[a-zA-Z]+)*)?' // for /collections and /collections/[selectedCollection]
                : page
        )
        .join('|')})$`
);

const QueryParamsSchema = v.object({
    path: v.pipe(v.string(), v.regex(possiblePaths)),
    secret: v.pipe(
        v.string(),
        v.check(secret => secret === process.env.REVALIDATE_SECRET)
    )
});

/**
 * API endpoint to perform on-demand revalidation of NFStudio pages.
 *
 * @param request - Nextjs request
 * @param response - Nextjs response
 */
export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    let query: v.InferOutput<typeof QueryParamsSchema>;

    try {
        query = v.parse(QueryParamsSchema, request.query);
    } catch {
        return response.status(401).send('Unauthorized.');
    }

    try {
        await response.revalidate(query.path);
        response.setHeader('Cache-Control', 'no-store');

        return response.status(200).json({ revalidated: true });
    } catch (error) {
        captureException(error);

        return response.status(500).send(`Error revalidating ${query.path}`);
    }
}
