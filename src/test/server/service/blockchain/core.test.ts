/* eslint-disable @typescript-eslint/no-unsafe-call */
import { describe, expect, vi, afterEach, it, Mock } from 'vitest';
import { Keypair, type Connection } from '@solana/web3.js';
import {
    InvalidCurrencyError,
    SYMBOL_TRANSFER_METHOD,
    createNFStudioTransferInstruction,
    createRefundTransactions,
    prepareNFStudioTransactionBatches,
    getRpcConnection
} from '@/server/service/blockchain/core';
import { SUPPORTED_CURRENCIES, type RefundWithCurrency } from '@/server/service/data/types';

const TEST_REFUNDS = [
    {
        id: '3oyRzLcufBx8vy1w14jimc3uyJJioiNaVGc3t2CysueU1dWSe93dkAKUzUdtQCHVSK6AXkr5TavE4WeDeBrRckZi',
        refunded: false,
        verified: true,
        createdAt: '2024-01-16T14:07:24.630Z',
        amount: '500',
        clientPublicKey: '2Jt9K7DHVmX34XDURAryKEMtk4unvYsFt9d3MmCWY8Kk',
        currency: {
            decimals: 9,
            mintAddress: '11111111111111111111111111111111',
            symbol: 'SOL'
        },
        helioTransactionId: '65a68d9c891bf6285d7d1656'
    },
    {
        id: '2nz2WYmB9daDEh815sMqgpKrpUWySw5sxgeFXScU1kznQep6mb4P6fNis7x9NzGsDuNHaVVX3aMEpi5k6hqC1Sdr',
        refunded: false,
        verified: true,
        createdAt: '2024-01-16T14:06:21.661Z',
        amount: '1000',
        clientPublicKey: '2Jt9K7DHVmX34XDURAryKEMtk4unvYsFt9d3MmCWY8Kk',
        currency: {
            decimals: 9,
            mintAddress: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
            symbol: 'USDC'
        },
        helioTransactionId: '65a68d5d71e9e9f5094428b3'
    }
] as unknown as RefundWithCurrency[];

const {
    ConnectionMock,
    TransactionMock,
    createSolTransferMock,
    createTokenTransferMock,
    createMemoInstructionMock
} = vi.hoisted(() => ({
    ConnectionMock: class {
        static constructorMock = vi.fn();
        constructor(...args) {
            ConnectionMock.constructorMock(...args);
        }
    },
    TransactionMock: class {
        instructions: unknown[] = [];

        add = vi.fn().mockImplementation((...instructions: unknown[]) => {
            this.instructions = instructions;
            return this;
        });
        sign = vi.fn();
    },
    createSolTransferMock: vi.fn(),
    createTokenTransferMock: vi.fn(),
    createMemoInstructionMock: vi.fn()
}));

vi.mock('@solana/web3.js', async importOriginal => {
    const actual: object = await importOriginal();
    return {
        ...actual,
        Connection: ConnectionMock,
        Transaction: TransactionMock
    };
});

vi.mock('@/server/service/blockchain/instruction', () => ({
    createSolTransfer: createSolTransferMock,
    createTokenTransfer: createTokenTransferMock,
    createMemoInstruction: createMemoInstructionMock
}));

describe('server/service/blockchain/core', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should have the correct supported currency symbols', () => {
        // setup
        const expectedSymbols = ['SOL', 'USDC', 'USDT', 'JUP', 'Bonk'];

        // verify
        expectedSymbols.forEach(symbol => {
            expect(SUPPORTED_CURRENCIES[symbol]).toEqual(symbol);
        });
    });

    it('should map the currency symbols to the proper transfer method', () => {
        // setup
        const expectedSymbols = ['SOL', 'USDC', 'USDT', 'JUP', 'Bonk'];

        // verify
        expectedSymbols.forEach(symbol => {
            expect(SYMBOL_TRANSFER_METHOD[symbol]).toEqual(
                symbol === 'SOL' ? createSolTransferMock : createTokenTransferMock
            );
        });
    });

    it('should select the correct NFStudio transfer method', () => {
        // setup
        const sol = 'sol instruction';
        const token = 'token instruction';
        createSolTransferMock.mockImplementationOnce(() => sol);
        createTokenTransferMock.mockImplementationOnce(() => token);
        const solOptions = {
            connection: {} as Connection,
            signer: {} as Keypair,
            transactionData: {
                amount: '500',
                currency: { symbol: 'SOL' }
            } as unknown as RefundWithCurrency
        };
        const tokenOptions = {
            connection: {} as Connection,
            signer: {} as Keypair,
            transactionData: {
                amount: '1000',
                currency: { symbol: 'USDC' }
            } as unknown as RefundWithCurrency
        };
        const invalidOptions = {
            connection: {} as Connection,
            signer: {} as Keypair,
            transactionData: {
                amount: '2000',
                currency: { symbol: 'INVALID' }
            } as unknown as RefundWithCurrency
        };

        // exercise && verify
        const solInstruction = createNFStudioTransferInstruction(solOptions);
        expect(solInstruction).toEqual(sol);
        expect(createSolTransferMock).toHaveBeenNthCalledWith(1, solOptions);

        const tokenInstruction = createNFStudioTransferInstruction(tokenOptions);
        expect(tokenInstruction).toEqual(token);
        expect(createTokenTransferMock).toHaveBeenNthCalledWith(1, tokenOptions);

        expect(() => createNFStudioTransferInstruction(invalidOptions)).toThrowError(
            new InvalidCurrencyError(invalidOptions.transactionData.currency.symbol)
        );
    });

    it('should create signed refund transactions', async () => {
        // setup
        const nfstudioTransactionBatches = [[TEST_REFUNDS[0]], [TEST_REFUNDS[1]]];
        const signer = Keypair.generate();
        const expectedTransactions = [
            { instructions: [{ some: 'first_inst' }, { memo: 'first_memo' }] },
            { instructions: [{ some: 'second_inst' }, { memo: 'second_memo' }] }
        ];
        createSolTransferMock.mockImplementationOnce(() =>
            Promise.resolve(expectedTransactions[0].instructions[0])
        );
        createTokenTransferMock.mockImplementationOnce(() =>
            Promise.resolve(expectedTransactions[1].instructions[0])
        );
        createMemoInstructionMock.mockImplementationOnce(
            () => expectedTransactions[0].instructions[1]
        );
        createMemoInstructionMock.mockImplementationOnce(
            () => expectedTransactions[1].instructions[1]
        );

        // exercise
        const transactions = await createRefundTransactions({
            refundsToProcess: TEST_REFUNDS,
            maxInstructionsPerTransaction: 1,
            blockhash: '12345',
            lastValidBlockHeight: 12345,
            signer
        });

        // verify
        expect(createSolTransferMock).toHaveBeenNthCalledWith(1, {
            signer,
            transactionData: TEST_REFUNDS[0]
        });
        expect(createTokenTransferMock).toHaveBeenNthCalledWith(1, {
            signer,
            transactionData: TEST_REFUNDS[1]
        });

        expect(createMemoInstructionMock).toHaveBeenCalledWith({
            signer,
            nfstudioTransactionIds: [TEST_REFUNDS[0].id]
        });
        expect(createMemoInstructionMock).toHaveBeenCalledWith({
            signer,
            nfstudioTransactionIds: [TEST_REFUNDS[1].id]
        });
        expect(createMemoInstructionMock).toHaveBeenCalledTimes(nfstudioTransactionBatches.length);

        expect(transactions.length).toEqual(nfstudioTransactionBatches.length);

        transactions.forEach((transaction, index) => {
            expect(transaction.add).toHaveBeenNthCalledWith(
                1,
                ...expectedTransactions[index].instructions
            );
            expect(transaction.recentBlockhash).toEqual('12345');
            expect(transaction.lastValidBlockHeight).toEqual(12345);
            expect(transaction.feePayer).toEqual(signer.publicKey);
            expect(transaction.sign).toHaveBeenNthCalledWith(1, signer);
        });
    });

    it('should prepare the refund transactions to process in batches', () => {
        // setup
        const expectedResult1 = [[TEST_REFUNDS[0]], [TEST_REFUNDS[1]]];
        const expectedResult2 = [[TEST_REFUNDS[0], TEST_REFUNDS[1]]];

        // exercise
        const result1 = prepareNFStudioTransactionBatches({
            refundsToProcess: TEST_REFUNDS,
            maxInstructionsPerTransaction: 1
        });
        const result2 = prepareNFStudioTransactionBatches({
            refundsToProcess: TEST_REFUNDS,
            maxInstructionsPerTransaction: 5
        });

        // verify
        expect(result1).toEqual(expectedResult1);
        expect(result2).toEqual(expectedResult2);
    });

    it('should correctly instantiate a RPC connection', () => {
        // setup
        vi.stubEnv('NFSTUDIO_RPC_ENDPOINT', 'rpc_endpoint');

        // exercise
        const connection = getRpcConnection();

        // verify
        expect(connection).toBeInstanceOf(ConnectionMock);
        expect(ConnectionMock.constructorMock as Mock).toHaveBeenNthCalledWith(1, 'rpc_endpoint', {
            disableRetryOnRateLimit: false,
            commitment: 'confirmed'
        });
        expect(getRpcConnection()).toEqual(connection);

        // cleanup
        vi.unstubAllEnvs();
    });
});
