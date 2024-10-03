import { describe, expect, vi, afterEach, it } from 'vitest';
import { isValidTransaction } from '@/server/service/helio/core';

const { decodeTokenMock, jwtHasExpiredMock } = vi.hoisted(() => ({
    decodeTokenMock: vi.fn(),
    jwtHasExpiredMock: vi.fn()
}));

vi.mock('@/server/service/auth', () => ({
    decodeToken: decodeTokenMock,
    jwtHasExpired: jwtHasExpiredMock
}));

describe('server/service/helio/core', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should not validate a transaction if status token do not have the required properties', () => {
        // setup
        const data = {
            payloadTx: '',
            fetchedTx: '',
            id: '',
            statusToken: 'token',
            createdAt: '',
            ignoreTxTime: false
        };
        decodeTokenMock.mockImplementationOnce(() => ({ transactionId: 'id', exp: 10 }));
        decodeTokenMock.mockImplementationOnce(() => ({
            transactionSignature: 'signature',
            exp: 10
        }));
        decodeTokenMock.mockImplementationOnce(() => ({ exp: 10 }));

        // exercise && verify
        expect(isValidTransaction(data)).toBe(false);
        expect(isValidTransaction(data)).toBe(false);
        expect(isValidTransaction(data)).toBe(false);
        expect(decodeTokenMock).toHaveBeenNthCalledWith(3, data.statusToken);
    });

    it('should not validate a transaction if input signatures/ids differ from the token ones when ignoring time', () => {
        // setup
        const data = {
            statusToken: 'token',
            createdAt: '',
            ignoreTxTime: true
        };
        const statusToken = 'token';
        const signature = 'sig1';
        const id = 'id1';
        decodeTokenMock.mockImplementation(() => ({
            transactionSignature: signature,
            transactionId: id,
            exp: 10
        }));

        // exercise && verify
        expect(
            isValidTransaction({
                payloadTx: signature,
                fetchedTx: 'different',
                id: 'different',
                ...data
            })
        ).toBe(false);
        expect(
            isValidTransaction({
                payloadTx: signature,
                fetchedTx: signature,
                id: 'different',
                ...data
            })
        ).toBe(false);
        expect(
            isValidTransaction({
                payloadTx: 'different',
                fetchedTx: signature,
                id: 'different',
                ...data
            })
        ).toBe(false);
        expect(
            isValidTransaction({
                payloadTx: 'different',
                fetchedTx: signature,
                id,
                ...data
            })
        ).toBe(false);
        expect(
            isValidTransaction({
                payloadTx: 'different',
                fetchedTx: 'different',
                id,
                ...data
            })
        ).toBe(false);
        expect(
            isValidTransaction({
                payloadTx: signature,
                fetchedTx: 'different',
                id,
                ...data
            })
        ).toBe(false);
        expect(decodeTokenMock).toHaveBeenNthCalledWith(6, statusToken);
        expect(jwtHasExpiredMock).not.toHaveBeenCalled();
    });

    it('should not validate a transaction if input signatures/ids are correct and is within window but it has already expired', () => {
        // setup
        vi.useFakeTimers();
        const statusToken = 'token';
        const signature = 'sig1';
        const id = 'id1';
        const ignoreTxTime = false;
        const date2MinutesAgo = new Date(new Date().getTime() - 2 * 60000).toISOString();
        const expiration = 12345;
        decodeTokenMock.mockImplementationOnce(() => ({
            transactionSignature: signature,
            transactionId: id,
            exp: expiration
        }));
        jwtHasExpiredMock.mockImplementationOnce(() => true);

        // exercise && verify
        expect(
            isValidTransaction({
                payloadTx: signature,
                fetchedTx: signature,
                id,
                statusToken,
                createdAt: date2MinutesAgo,
                ignoreTxTime
            })
        ).toBe(false);
        expect(decodeTokenMock).toHaveBeenNthCalledWith(1, statusToken);
        expect(jwtHasExpiredMock).toHaveBeenNthCalledWith(1, expiration);

        // cleanup
        vi.useRealTimers();
    });

    it('should not validate a transaction if input signatures/ids are correct and is not expired but it happened more than 3 minutes ago', () => {
        // setup
        vi.useFakeTimers();
        const statusToken = 'token';
        const signature = 'sig1';
        const id = 'id1';
        const ignoreTxTime = false;
        const date4MinutesAgo = new Date(new Date().getTime() - 4 * 60000).toISOString();
        const expiration = 12345;
        decodeTokenMock.mockImplementationOnce(() => ({
            transactionSignature: signature,
            transactionId: id,
            exp: expiration
        }));
        jwtHasExpiredMock.mockImplementationOnce(() => false);

        // exercise && verify
        expect(
            isValidTransaction({
                payloadTx: signature,
                fetchedTx: signature,
                id,
                statusToken,
                createdAt: date4MinutesAgo,
                ignoreTxTime
            })
        ).toBe(false);
        expect(decodeTokenMock).toHaveBeenNthCalledWith(1, statusToken);
        expect(jwtHasExpiredMock).toHaveBeenNthCalledWith(1, expiration);

        // cleanup
        vi.useRealTimers();
    });

    it('should validate a transaction when ignoring transaction time', () => {
        // setup
        const statusToken = 'token';
        const signature = 'sig1';
        const id = 'id1';
        const ignoreTxTime = true;
        const createdAt = '';
        const expiration = 12345;
        decodeTokenMock.mockImplementationOnce(() => ({
            transactionSignature: signature,
            transactionId: id,
            exp: expiration
        }));

        // exercise && verify
        expect(
            isValidTransaction({
                payloadTx: signature,
                fetchedTx: signature,
                id,
                statusToken,
                createdAt,
                ignoreTxTime
            })
        ).toBe(true);

        expect(decodeTokenMock).toHaveBeenNthCalledWith(1, statusToken);
        expect(jwtHasExpiredMock).not.toHaveBeenCalled();
    });

    it('should validate a transaction taking creation time into consideration', () => {
        // setup
        vi.useFakeTimers();
        const statusToken = 'token';
        const signature = 'sig1';
        const id = 'id1';
        const ignoreTxTime = false;
        const date1MinuteAgo = new Date(new Date().getTime() - 1 * 60000).toISOString();
        const expiration = 12345;
        decodeTokenMock.mockImplementationOnce(() => ({
            transactionSignature: signature,
            transactionId: id,
            exp: expiration
        }));
        jwtHasExpiredMock.mockImplementationOnce(() => false);

        // exercise && verify
        expect(
            isValidTransaction({
                payloadTx: signature,
                fetchedTx: signature,
                id,
                statusToken,
                createdAt: date1MinuteAgo,
                ignoreTxTime
            })
        ).toBe(true);
        expect(decodeTokenMock).toHaveBeenNthCalledWith(1, statusToken);
        expect(jwtHasExpiredMock).toHaveBeenNthCalledWith(1, expiration);

        // cleanup
        vi.useRealTimers();
    });
});
