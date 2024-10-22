import type { NextApiRequest, NextApiResponse } from 'next';
import * as v from 'valibot';
import { getVerifiedNFStudioRefundTransaction } from '@/server/service/helio';
import { TransactionValidationError } from '@/server/service/helio/core';
import type { NFStudioVerifiedRefundTransaction } from '@/server/service/helio/types';
import { insertRefundTransaction } from '@/server/service/mongo';
import { order } from '@/server/service/nft-converter';
import { captureException, getCurrentScope } from '@sentry/nextjs';
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
    transactionSignature: v.pipe(v.string(), v.regex(/^[1-9A-HJ-NP-Za-km-z]{86,88}$/)) // Solana Tx -> 64-byte array, encoded in Base58
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
    } catch (error) {
        captureException(error);
        return response.status(400).send('Bad request.');
    }

    const { transactionSignature, ...orderOptions } = body;

    let transaction: NFStudioVerifiedRefundTransaction;

    try {
        transaction = await getVerifiedNFStudioRefundTransaction({
            payloadTx: transactionSignature
        });
    } catch (error) {
        const scope = getCurrentScope();
        scope.setContext('transaction', {
            id: transactionSignature
        });

        if (error instanceof TransactionValidationError) {
            captureException(error, scope);
            return response.status(401).send('Unauthorized.');
        }

        // save tx as unverified. It can be authentic, but due to error we need to re-evaluate
        try {
            await insertRefundTransaction({
                _id: transactionSignature,
                verified: false,
                refunded: false,
                createdAt: new Date().toISOString()
            });
        } catch (error) {
            // transaction data wasn't persisted
            captureException(error, scope);
        }

        captureException(error, scope);

        return response
            .status(500)
            .send('An unexpected error occurred while validating the transaction.');
    }

    try {
        const buffer = await order(orderOptions);
        response.setHeader('Content-Type', 'application/octet-stream');

        return response.status(201).send(buffer);
    } catch (error) {
        const scope = getCurrentScope();
        scope.setContext('transaction', transaction);

        try {
            await insertRefundTransaction(transaction);
        } catch (error) {
            // transaction data wasn't persisted
            captureException(error, scope);
        }

        captureException(error, scope);

        return response.status(500).send('An unexpected error occurred while creating the image.');
    }
}
