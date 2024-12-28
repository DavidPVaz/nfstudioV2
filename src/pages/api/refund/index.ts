import type { NextApiRequest, NextApiResponse } from 'next';
import * as v from 'valibot';
import {
    queryVerifiedRefundTransactionsToProcess,
    updateManyRefundTransactions
} from '@/server/service/data';
import { refund, getRefundedIdsFromProcessedTransactions } from '@/server/service/blockchain';
import { captureException } from '@sentry/nextjs';

const HeadersSchema = v.object({
    authorization: v.pipe(
        v.string(),
        v.check(authHeader => authHeader === `Bearer ${process.env.CRON_SECRET}`)
    )
});
/**
 * API endpoint to refund NFStudio client purchases.
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
        const refundsToProcess = await queryVerifiedRefundTransactionsToProcess();

        if (refundsToProcess.length === 0) {
            return response.status(200).send('No refunds to process.');
        }

        const refundTransactionSignatures = await refund({ refundsToProcess });

        const refunded = await getRefundedIdsFromProcessedTransactions(refundTransactionSignatures);

        await Promise.all(
            refunded.map(({ associatedRefundTransactionSignature, confirmed, refundedIds }) =>
                updateManyRefundTransactions({
                    ids: refundedIds,
                    newState: { refunded: confirmed, associatedRefundTransactionSignature }
                })
            )
        );

        return response.status(200).json({ refunded });
    } catch (error) {
        captureException(error);

        return response.status(500).send('Error processing refunds.');
    }
}
