import type { NextApiRequest, NextApiResponse } from 'next';
import * as v from 'valibot';
import {
    queryUnverifiedRefundTransactionsToReevaluate,
    updateOneRefundTransaction,
    batch
} from '@/server/service/data';
import { reevaluateUnverifiedTransactions } from '@/server/service/helio';
import { captureException } from '@sentry/nextjs';

const HeadersSchema = v.object({
    authorization: v.pipe(
        v.string(),
        v.check(authHeader => authHeader === `Bearer ${process.env.CRON_SECRET}`)
    )
});

/**
 * API endpoint to reevaluate unverified refund transactions.
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
        const unverifiedRefundTransactions = await queryUnverifiedRefundTransactionsToReevaluate();

        if (unverifiedRefundTransactions.length === 0) {
            return response.status(200).send('No unverified refund transactions to reevaluate.');
        }

        const reevaluationResult = await reevaluateUnverifiedTransactions(
            unverifiedRefundTransactions
        );

        await batch(
            reevaluationResult.map(reevaluatedTransaction =>
                updateOneRefundTransaction(reevaluatedTransaction)
            )
        );

        return response
            .status(200)
            .send('Unverified refund transactions reevaluated with success.');
    } catch (error) {
        captureException(error);

        return response
            .status(500)
            .send(
                'An unexpected error occurred while reevaluating unverified refund transactions.'
            );
    }
}
