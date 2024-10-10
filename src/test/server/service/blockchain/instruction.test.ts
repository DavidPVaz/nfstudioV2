/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { describe, expect, vi, afterEach, it, Mock } from 'vitest';
import { Keypair, PublicKey } from '@solana/web3.js';
import {
    createSolTransfer,
    createTokenTransfer,
    createMemoInstruction
} from '@/server/service/blockchain/instruction';
import type { NFStudioVerifiedRefundTransaction } from '@/server/service/helio/types';
import type { Connection } from '@solana/web3.js';

const {
    SystemProgramMock,
    ConnectionMock,
    TransactionInstructionMock,
    getOrCreateAssociatedTokenAccountMock,
    createTransferInstructionMock
} = vi.hoisted(() => ({
    SystemProgramMock: class {
        static transfer = vi.fn();
    },
    ConnectionMock: class {},
    TransactionInstructionMock: class {
        static constructorMock = vi.fn();
        constructor(instructionConfig: unknown) {
            TransactionInstructionMock.constructorMock(instructionConfig);
        }
    },
    getOrCreateAssociatedTokenAccountMock: vi.fn(),
    createTransferInstructionMock: vi.fn()
}));

vi.mock('@solana/web3.js', async importOriginal => {
    const actual: object = await importOriginal();
    return {
        ...actual,
        SystemProgram: SystemProgramMock,
        Connection: ConnectionMock,
        TransactionInstruction: TransactionInstructionMock
    };
});

vi.mock('@solana/spl-token', async importOriginal => {
    const actual: object = await importOriginal();
    return {
        ...actual,
        getOrCreateAssociatedTokenAccount: getOrCreateAssociatedTokenAccountMock,
        createTransferInstruction: createTransferInstructionMock
    };
});

describe('server/service/blockchain/instruction', () => {
    const signer = Keypair.generate();

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should create a SOL transfer instruction', () => {
        // setup
        SystemProgramMock.transfer.mockImplementationOnce(() => 'result');
        const transactionData = {
            clientPublicKey: '2Jt9K7DHVmX34XDURAryKEMtk4unvYsFt9d3MmCWY8Kk',
            amount: '500'
        } as unknown as NFStudioVerifiedRefundTransaction;
        const expectedTransferData = {
            fromPubkey: signer.publicKey,
            toPubkey: new PublicKey(transactionData.clientPublicKey),
            lamports: BigInt(transactionData.amount)
        };

        // exercise
        const result = createSolTransfer({ signer, transactionData });

        // verify
        expect(result).toEqual('result');
        expect(SystemProgramMock.transfer).toHaveBeenNthCalledWith(1, expectedTransferData);
    });

    it('should create a TOKEN transfer instruction', async () => {
        // setup
        const connection = new ConnectionMock() as unknown as Connection;
        const transactionData = {
            clientPublicKey: '2Jt9K7DHVmX34XDURAryKEMtk4unvYsFt9d3MmCWY8Kk',
            amount: '500',
            currency: { mintAddress: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU' }
        } as unknown as NFStudioVerifiedRefundTransaction;
        const nfstudioTokenAccount = { address: 'A' };
        const toClientTokenAccount = { address: 'B' };
        getOrCreateAssociatedTokenAccountMock.mockImplementationOnce(() =>
            Promise.resolve(nfstudioTokenAccount)
        );
        getOrCreateAssociatedTokenAccountMock.mockImplementationOnce(() =>
            Promise.resolve(toClientTokenAccount)
        );
        const tokenMintAddress = new PublicKey(transactionData.currency.mintAddress);

        // exercise
        await createTokenTransfer({ connection, signer, transactionData });

        // verify
        expect(getOrCreateAssociatedTokenAccountMock).toHaveBeenCalledWith(
            connection,
            signer,
            tokenMintAddress,
            signer.publicKey
        );
        expect(getOrCreateAssociatedTokenAccountMock).toHaveBeenCalledWith(
            connection,
            signer,
            tokenMintAddress,
            new PublicKey(transactionData.clientPublicKey)
        );
        expect(getOrCreateAssociatedTokenAccountMock).toHaveBeenCalledTimes(2);
        expect(createTransferInstructionMock).toHaveBeenNthCalledWith(
            1,
            nfstudioTokenAccount.address,
            toClientTokenAccount.address,
            signer.publicKey,
            BigInt(transactionData.amount)
        );
    });

    it('should create a MEMO instruction', () => {
        // setup
        const nfstudioTransactionIds = ['id1', 'id2', 'id3', 'id4'];
        const expectedInstructionData = {
            keys: [{ pubkey: signer.publicKey, isSigner: true, isWritable: true }],
            data: Buffer.from(JSON.stringify(nfstudioTransactionIds), 'utf-8'),
            programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr')
        };

        // exercise
        const result = createMemoInstruction({ signer, nfstudioTransactionIds });

        // verify
        expect(result).toBeInstanceOf(TransactionInstructionMock);
        expect(TransactionInstructionMock.constructorMock as Mock).toHaveBeenNthCalledWith(
            1,
            expectedInstructionData
        );
    });
});
