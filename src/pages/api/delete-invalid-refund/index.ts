import type { NextApiRequest, NextApiResponse } from 'next';
import * as v from 'valibot';
import { deleteInvalidRefundTransactions } from '@/server/service/data';
import { captureException } from '@sentry/nextjs';

const HeadersSchema = v.object({
    authorization: v.pipe(
        v.string(),
        v.check(authHeader => authHeader === `Bearer ${process.env.CRON_SECRET}`)
    )
});

/**
 * API endpoint to delete invalid refund transactions that are flagged for deletion.
 *
 * @param request - Nextjs request
 * @param response - Nextjs response
 */
export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    try {
        v.parse(HeadersSchema, request.headers);
    } catch {
        return response.status(401).send('Unauthorized.');
    }

    response.setHeader('Cache-Control', 'no-store');

    try {
        await deleteInvalidRefundTransactions();

        return response.status(200).send('Invalid refund transactions deleted with success.');
    } catch (error) {
        captureException(error);

        return response
            .status(500)
            .send('An unexpected error occurred while deleting invalid refund transactions.');
    }
}
