import Decimal from 'decimal.js';
import {
    helioApiGETRequest,
    isValidTransaction,
    TransactionValidationError
} from '@/server/service/helio/core';
import type {
    Transaction,
    PurchaseDetails,
    NFStudioVerifiedRefundTransaction,
    NFStudioUnverifiedRefundTransaction
} from '@/server/service/helio/types';

/**
 * Get a verified NFStudio refund transaction.
 *
 * @param options
 * @param options.payloadTx - the transaction signature to verify received via NFStudio API call
 * @param options.statusToken - the JWT token to be decoded that includes the transaction signature and its id
 * @param options.ignoreTxTime - wether to ignore the time at which transaction took place
 *
 * @throws {HelioApiRequestError} if request to Helio api fails
 * @throws {TransactionValidationError} if the transaction is not valid
 */
export const getVerifiedNFStudioRefundTransaction = async ({
    payloadTx,
    statusToken,
    ignoreTxTime = false
}: {
    payloadTx: string;
    statusToken: string;
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
            currency: { decimals, mintAddress, symbol },
            customerDetails: { additionalJSON = '{}' }
        }
    } = await helioApiGETRequest<Transaction>({
        path: `transactions/signature/${payloadTx}`
    });

    if (
        !isValidTransaction({
            payloadTx,
            fetchedTx,
            id,
            statusToken,
            createdAt,
            ignoreTxTime
        })
    ) {
        throw new TransactionValidationError(`Transaction ${payloadTx} is not valid.`, 401);
    }

    return {
        verified: true,
        refunded: false,
        _id: fetchedTx,
        paylinkId,
        statusToken,
        helioTransactionId: id,
        createdAt,
        clientPublicKey,
        amount: Decimal.add(amount, helioXFee).toString(),
        currency: { decimals, mintAddress, symbol },
        purchaseDetails: JSON.parse(additionalJSON) as PurchaseDetails
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
        unverifiedRefundTransactions.map(async ({ _id, statusToken, ...unverified }) => {
            try {
                const verifiedTransaction = await getVerifiedNFStudioRefundTransaction({
                    payloadTx: _id,
                    statusToken,
                    ignoreTxTime: true
                });

                return verifiedTransaction;
            } catch (error) {
                // It is not a valid transaction - flag for deletion
                if (error instanceof TransactionValidationError) {
                    return { ...unverified, _id, statusToken, canDelete: true };
                }

                // Fetch error, do nothing to the transaction
                // attempt to reverify on later call
                return { ...unverified, _id, statusToken };
            }
        })
    );
