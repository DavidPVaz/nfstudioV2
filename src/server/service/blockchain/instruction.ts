import { PublicKey, TransactionInstruction, SystemProgram, Keypair } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, createTransferInstruction } from '@solana/spl-token';
import type { NFStudioVerifiedRefundTransaction } from '@/server/service/helio/types';
import { getRpcConnection } from '@/server/service/blockchain/core';

/**
 * Create a transaction instruction to transfer SOL in solana network.
 *
 * @param options
 * @param options.signer - NFStudio wallet key pair
 * @param options.transactionData - NFStudio refund transaction data
 */
export const createSolTransfer = ({
    signer,
    transactionData: { clientPublicKey, amount }
}: {
    signer: Keypair;
    transactionData: NFStudioVerifiedRefundTransaction;
}) =>
    SystemProgram.transfer({
        fromPubkey: signer.publicKey,
        toPubkey: new PublicKey(clientPublicKey),
        lamports: BigInt(amount)
    });

/**
 * Create a transaction instruction to transfer TOKEN in solana network.
 *
 * @param options
 * @param options.signer - NFStudio wallet key pair
 * @param options.transactionData - NFStudio refund transaction data
 */
export const createTokenTransfer = async ({
    signer,
    transactionData: {
        clientPublicKey,
        amount,
        currency: { mintAddress }
    }
}: {
    signer: Keypair;
    transactionData: NFStudioVerifiedRefundTransaction;
}) => {
    const tokenMintAddress = new PublicKey(mintAddress);
    const connection = getRpcConnection();

    const [nfstudioTokenAccount, toClientTokenAccount] = await Promise.all([
        getOrCreateAssociatedTokenAccount(connection, signer, tokenMintAddress, signer.publicKey),
        getOrCreateAssociatedTokenAccount(
            connection,
            signer,
            tokenMintAddress,
            new PublicKey(clientPublicKey)
        )
    ]);

    return createTransferInstruction(
        nfstudioTokenAccount.address,
        toClientTokenAccount.address,
        signer.publicKey,
        BigInt(amount)
    );
};

/**
 * Creates a memo transaction instruction with all verified NFStudio refund transaction ids as message data.
 *
 * @param options
 * @param options.signer - NFStudio wallet key pair
 * @param options.nfstudioTransactionIds - NFStudio transactions to include in the memo
 */
export const createMemoInstruction = ({
    signer,
    nfstudioTransactionIds
}: {
    signer: Keypair;
    nfstudioTransactionIds: NFStudioVerifiedRefundTransaction['_id'][];
}) =>
    new TransactionInstruction({
        keys: [{ pubkey: signer.publicKey, isSigner: true, isWritable: true }],
        data: Buffer.from(JSON.stringify(nfstudioTransactionIds), 'utf8'),
        programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr')
    });
