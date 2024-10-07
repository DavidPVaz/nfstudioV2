import { Connection, Transaction, Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import {
    createSolTransfer,
    createTokenTransfer,
    createMemoInstruction
} from '@/server/service/blockchain/instruction';
import {
    type NFStudioVerifiedRefundTransaction,
    SUPPORTED_CURRENCIES
} from '@/server/service/helio/types';

/**
 * NFStudio custom rpc endpoint to perform requests to the solana network.
 */
const NFSTUDIO_CUSTOM_RPC_ENDPOINT = `https://${process.env.CLUSTER_TYPE}.helius-rpc.com/?api-key=${process.env.HELIUS_RPC_API_KEY}`;
const NFSTUDIO_QUICKNODE_RPC_ENDPOINT =
    'https://multi-omniscient-sailboat.solana-mainnet.quiknode.pro/7b234653e521c056b62eff5d533ba3ef281f71c4/';

/**
 * Pointer for a loaded RPC connection in memory.
 */
let connection: Connection | null = null;

export class InvalidCurrencyError extends Error {}

/**
 * Maps supported currency symbols to a transfer method.
 */
export const SYMBOL_TRANSFER_METHOD = {
    [SUPPORTED_CURRENCIES.SOL]: createSolTransfer,
    [SUPPORTED_CURRENCIES.USDC]: createTokenTransfer,
    [SUPPORTED_CURRENCIES.USDT]: createTokenTransfer,
    [SUPPORTED_CURRENCIES.JUP]: createTokenTransfer,
    [SUPPORTED_CURRENCIES.Bonk]: createTokenTransfer
};

/**
 * Create a transfer transaction instruction to be executed by NFStudio.
 *
 * @param options
 * @param options.connection - rpc connection
 * @param options.signer - NFStudio wallet key pair
 * @param options.transactionData - NFStudio refund transaction data
 *
 * @throws {InvalidCurrencyError} Will throw an error if currency is not supported
 */
export const createNFStudioTransferInstruction = (options: {
    connection: Connection;
    signer: Keypair;
    transactionData: NFStudioVerifiedRefundTransaction;
}) => {
    const {
        transactionData: {
            currency: { symbol }
        }
    } = options;

    const transferMethod = SYMBOL_TRANSFER_METHOD[symbol];

    if (!transferMethod) {
        throw new InvalidCurrencyError(symbol);
    }

    return transferMethod(options);
};

/**
 * Create signed transactions to refund the NFStudio clients.
 *
 * @param options
 * @param options.refundsToProcess - verified transactions fetched from NFStudio database to be refunded
 * @param options.maxInstructionsPerTransaction - max number of instructions per transaction which also refers to the number of instructions in each batch
 * @param options.connection - rpc connection
 * @param options.signer - wallet that will sign the transactions - defaults to NFStudio wallet
 */
export const createRefundTransactions = async ({
    refundsToProcess,
    maxInstructionsPerTransaction,
    connection,
    signer = Keypair.fromSecretKey(bs58.decode(process.env.NFSTUDIO_WALLET_PRIVATE_KEY!))
}: {
    refundsToProcess: NFStudioVerifiedRefundTransaction[];
    maxInstructionsPerTransaction: number;
    connection: Connection;
    signer?: Keypair;
}) => {
    const nfstudioTransactionBatches = prepareNFStudioTransactionBatches({
        refundsToProcess,
        maxInstructionsPerTransaction
    });

    const transactions = (
        await Promise.all(
            nfstudioTransactionBatches.map(async batch => {
                const transferInstructions = await Promise.all(
                    batch.map(transactionData =>
                        createNFStudioTransferInstruction({
                            connection,
                            signer,
                            transactionData
                        })
                    )
                );

                return {
                    transferInstructions,
                    nfstudioTransactionIds: batch.map(({ _id }) => _id)
                };
            })
        )
    ).map(({ transferInstructions, nfstudioTransactionIds }) =>
        new Transaction().add(
            ...transferInstructions,
            createMemoInstruction({ signer, nfstudioTransactionIds })
        )
    );

    const blockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;

    transactions.forEach(transaction => {
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = signer.publicKey;
        transaction.sign(signer);
    });

    return transactions;
};

/**
 * Prepare the verified NFStudio transactions to refund clients to be organized in batches.
 *
 * @param options
 * @param options.refundsToProcess - verified transactions fetched from NFStudio database to be refunded
 * @param options.maxInstructionsPerTransaction - max number of instructions per transaction which also refers to the number of instructions in each batch
 */
export const prepareNFStudioTransactionBatches = ({
    refundsToProcess,
    maxInstructionsPerTransaction
}: {
    refundsToProcess: NFStudioVerifiedRefundTransaction[];
    maxInstructionsPerTransaction: number;
}) => {
    const batches: NFStudioVerifiedRefundTransaction[][] = [];

    for (let index = 0; index < refundsToProcess.length; index += maxInstructionsPerTransaction) {
        const slice =
            index + maxInstructionsPerTransaction > refundsToProcess.length
                ? [index]
                : [index, index + maxInstructionsPerTransaction];

        batches.push(refundsToProcess.slice(...slice));
    }

    return batches;
};

/**
 * Retrieves a RPC connection to the solana network.
 */
export const getRpcConnection = () =>
    connection ??
    (connection = new Connection(
        process.env.VERCEL_ENV === 'production'
            ? NFSTUDIO_QUICKNODE_RPC_ENDPOINT
            : NFSTUDIO_CUSTOM_RPC_ENDPOINT,
        {
            disableRetryOnRateLimit: false,
            commitment: 'confirmed'
        }
    ));
