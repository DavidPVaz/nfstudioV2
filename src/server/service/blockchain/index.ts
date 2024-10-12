import { ParsedInstruction, PublicKey } from '@solana/web3.js';
import { createRefundTransactions, getRpcConnection } from '@/server/service/blockchain/core';
import { type NFStudioVerifiedRefundTransaction } from '@/server/service/helio/types';

/**
 * Refund purchases made by NFStudio clients.
 *
 * @param options
 * @param options.refundsToProcess - verified transactions fetched from NFStudio database to be refunded
 * @param options.maxInstructionsPerTransaction - max number of instructions per transaction which also refers to the number of instructions in each batch
 */
export const refund = async ({
    refundsToProcess,
    maxInstructionsPerTransaction = 6
}: {
    refundsToProcess: NFStudioVerifiedRefundTransaction[];
    maxInstructionsPerTransaction?: number;
}) => {
    const connection = getRpcConnection();
    const blockhashWithExpiryBlockHeight = await connection.getLatestBlockhash('confirmed');

    const refundTransactions = await createRefundTransactions({
        refundsToProcess,
        maxInstructionsPerTransaction,
        ...blockhashWithExpiryBlockHeight
    });

    const refundTransactionsOutput = await Promise.all(
        refundTransactions.map(transaction =>
            connection.sendRawTransaction(transaction.serialize(), {
                preflightCommitment: 'confirmed',
                skipPreflight: true
            })
        )
    );

    return Promise.all(
        refundTransactionsOutput.map(async signature => {
            const {
                value: { err }
            } = await connection.confirmTransaction(
                { ...blockhashWithExpiryBlockHeight, signature },
                'confirmed'
            );

            return { signature, confirmed: err === null };
        })
    );
};

/**
 * Get a list of verified NFStudio transaction ids that were successfully refunded.
 *
 * @param refundTransactionSignatures - the transaction signatures of the processed refund transactions and its confirmed status
 */
export const getRefundedIdsFromProcessedTransactions = async (
    refundTransactionSignatures: {
        signature: string;
        confirmed: boolean;
    }[]
) => {
    const connection = getRpcConnection();

    return Promise.all(
        refundTransactionSignatures.map(async ({ signature, confirmed }) => {
            const {
                transaction: {
                    message: { instructions }
                }
            } = (await connection.getParsedTransaction(signature, 'confirmed'))!;

            // find our memo instruction that contains all NFStudio refund ids
            // included in the successful transaction
            const memoInstruction = instructions.find(({ programId }) =>
                programId.equals(new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'))
            ) as ParsedInstruction;

            return {
                associatedRefundTransactionSignature: signature,
                confirmed,
                refundedIds: JSON.parse(
                    memoInstruction.parsed as string
                ) as NFStudioVerifiedRefundTransaction['_id'][]
            };
        })
    );
};
