import Decimal from 'decimal.js';
import {
    isWithinWindow,
    helioApiGETRequest,
    TransactionValidationError
} from '@/server/service/helio/core';
import type {
    Transaction,
    NFStudioVerifiedRefundTransaction,
    NFStudioUnverifiedRefundTransaction
} from '@/server/service/helio/types';

/**
 * Get a verified NFStudio refund transaction.
 *
 * @param options
 * @param options.payloadTx - the transaction signature to verify received via NFStudio API call
 * @param options.ignoreTxTime - wether to ignore the time at which transaction took place
 *
 * @throws {HelioApiRequestError} if request to Helio api fails
 * @throws {TransactionValidationError} if the transaction is not valid
 */
export const getVerifiedNFStudioRefundTransaction = async ({
    payloadTx,
    ignoreTxTime = false
}: {
    payloadTx: string;
    ignoreTxTime?: boolean;
}): Promise<NFStudioVerifiedRefundTransaction> => {
    const {
        id,
        paylinkId,
        createdAt,
        fee: helioXFee,
        meta: {
            amount,
            senderPK: clientPublicKey,
            transactionSignature: fetchedTx,
            currency: { symbol }
        }
    } = await helioApiGETRequest<Transaction>({
        path: `transactions/signature/${payloadTx}`
    });

    if (!ignoreTxTime && !isWithinWindow({ createdAt, minutes: 3 })) {
        throw new TransactionValidationError(`Transaction ${payloadTx} is not valid.`, 401);
    }

    return {
        verified: true,
        refunded: false,
        id: fetchedTx,
        paylinkId,
        helioTransactionId: id,
        createdAt,
        clientPublicKey,
        amount: Decimal.add(amount, helioXFee).toString(),
        currency: symbol,
        chain: 'Solana'
    };
};

/**
 * Attempts to reverify any unverified NFStudio refund transaction previously persisted.
 *
 * @param unverifiedRefundTransactions - the unverified transactions to reevaluate
 */
export const reevaluateUnverifiedTransactions = (
    unverifiedRefundTransactions: NFStudioUnverifiedRefundTransaction[]
): Promise<(NFStudioVerifiedRefundTransaction | NFStudioUnverifiedRefundTransaction)[]> =>
    Promise.all(
        unverifiedRefundTransactions.map(async ({ id, ...unverified }) => {
            try {
                const verifiedTransaction = await getVerifiedNFStudioRefundTransaction({
                    payloadTx: id,
                    ignoreTxTime: true
                });

                return verifiedTransaction;
            } catch (error) {
                // It is not a valid transaction - flag for deletion
                if (error instanceof TransactionValidationError) {
                    return { ...unverified, id, canDelete: true };
                }

                // Fetch error, do nothing to the transaction
                // attempt to reverify on later call
                return { ...unverified, id };
            }
        })
    );
