import type { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
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
        v.check(secret => secret === process.env.SECRET)
    )
});

/**
 * API endpoint to perform on-demand revalidation of NFStudio pages.
 *
 * @param request - Nextjs request
 */
export function POST(request: NextRequest) {
    let query: v.InferOutput<typeof QueryParamsSchema>;
    const path = request.nextUrl.searchParams.get('path');
    const secret = request.nextUrl.searchParams.get('secret');

    try {
        query = v.parse(QueryParamsSchema, { path, secret });
    } catch {
        return new Response(null, { status: 401 });
    }

    try {
        revalidatePath(query.path);

        return Response.json({ revalidated: true });
    } catch (error) {
        captureException(error);

        return new Response(`An unexpected error occurred while revalidating ${query.path}`, {
            status: 500
        });
    }
}
