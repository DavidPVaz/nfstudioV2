import { PublicKey, TransactionInstruction, SystemProgram, type Keypair } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, createTransferInstruction } from '@solana/spl-token';
import { getRpcConnection } from '@/server/service/blockchain/core';
import type { RefundWithCurrency } from '@/server/service/data/types';

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
    transactionData: RefundWithCurrency;
}) =>
    SystemProgram.transfer({
        fromPubkey: signer.publicKey,
        toPubkey: new PublicKey(clientPublicKey!),
        lamports: BigInt(amount!)
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
        currency: { address }
    }
}: {
    signer: Keypair;
    transactionData: RefundWithCurrency;
}) => {
    const tokenMintAddress = new PublicKey(address);
    const connection = getRpcConnection();

    const [nfstudioTokenAccount, toClientTokenAccount] = await Promise.all([
        getOrCreateAssociatedTokenAccount(connection, signer, tokenMintAddress, signer.publicKey),
        getOrCreateAssociatedTokenAccount(
            connection,
            signer,
            tokenMintAddress,
            new PublicKey(clientPublicKey!)
        )
    ]);

    return createTransferInstruction(
        nfstudioTokenAccount.address,
        toClientTokenAccount.address,
        signer.publicKey,
        BigInt(amount!)
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
    nfstudioTransactionIds: RefundWithCurrency['id'][];
}) =>
    new TransactionInstruction({
        keys: [{ pubkey: signer.publicKey, isSigner: true, isWritable: true }],
        data: Buffer.from(JSON.stringify(nfstudioTransactionIds), 'utf8'),
        programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr')
    });
