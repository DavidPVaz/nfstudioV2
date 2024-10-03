import { describe, expect, vi, afterEach, it } from 'vitest';
import {
    helioApiGETRequest,
    isValidTransaction,
    HelioApiRequestError,
    TransactionValidationError
} from '@/server/service/helio/core';
import { NFStudioRequestError } from '@/server/service/shared/http';

const { decodeTokenMock, jwtHasExpiredMock, customFetchMock } = vi.hoisted(() => ({
    decodeTokenMock: vi.fn(),
    jwtHasExpiredMock: vi.fn(),
    customFetchMock: vi.fn()
}));

vi.mock('@/server/service/auth', () => ({
    decodeToken: decodeTokenMock,
    jwtHasExpired: jwtHasExpiredMock
}));

vi.mock('@/server/service/shared/http', async importOriginal => {
    const actual: object = await importOriginal();
    return {
        ...actual,
        customFetch: customFetchMock
    };
});

describe('server/service/helio/core', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    /** */

    it('should perform a Helio Api GET Request', async () => {
        // setup
        const path = 'some/path';
        const expected = {
            retries: 1,
            options: {
                url: `${process.env.HELIO_API_ENDPOINT}/${path}?publicKey=${process.env.HELIO_PUBLIC_API_KEY}`,
                init: {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json;',
                        Authorization: `Bearer ${process.env.HELIO_SECRET_API_KEY}`
                    }
                }
            }
        };
        const responseData = { data: 'data' };
        customFetchMock.mockImplementationOnce(() => Promise.resolve(responseData));

        // exercise
        const result = await helioApiGETRequest({ path });

        // verify
        expect(result).toEqual(responseData);
        expect(customFetchMock).toHaveBeenNthCalledWith(1, expected);
    });

    it('should throw HelioApiRequestError', async () => {
        // setup
        const statusText = 'message';
        const status = 500;
        const path = 'some/path';
        const expected = {
            retries: 2,
            options: {
                url: `${process.env.HELIO_API_ENDPOINT}/${path}?publicKey=${process.env.HELIO_PUBLIC_API_KEY}`,
                init: {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json;',
                        Authorization: `Bearer ${process.env.HELIO_SECRET_API_KEY}`
                    }
                }
            }
        };
        customFetchMock.mockRejectedValueOnce(new NFStudioRequestError(statusText, status));

        // exercise && verify
        await expect(helioApiGETRequest({ path, retries: 2 })).rejects.toThrowError(
            new HelioApiRequestError(statusText, status)
        );
        expect(customFetchMock).toHaveBeenNthCalledWith(1, expected);
    });

    it('should throw TransactionValidationError on 401', async () => {
        // setup
        const statusText = 'message';
        const status = 401;
        const path = 'some/path';
        const expected = {
            retries: 1,
            options: {
                url: `${process.env.HELIO_API_ENDPOINT}/${path}?publicKey=${process.env.HELIO_PUBLIC_API_KEY}`,
                init: {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json;',
                        Authorization: `Bearer ${process.env.HELIO_SECRET_API_KEY}`
                    }
                }
            }
        };
        customFetchMock.mockRejectedValueOnce(new NFStudioRequestError(statusText, status));

        // exercise && verify
        await expect(helioApiGETRequest({ path })).rejects.toThrowError(
            new TransactionValidationError(statusText, status)
        );
        expect(customFetchMock).toHaveBeenNthCalledWith(1, expected);
    });

    it('should throw TransactionValidationError on 404', async () => {
        // setup
        const statusText = 'message';
        const status = 404;
        const path = 'some/path';
        const expected = {
            retries: 1,
            options: {
                url: `${process.env.HELIO_API_ENDPOINT}/${path}?publicKey=${process.env.HELIO_PUBLIC_API_KEY}`,
                init: {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json;',
                        Authorization: `Bearer ${process.env.HELIO_SECRET_API_KEY}`
                    }
                }
            }
        };
        customFetchMock.mockRejectedValueOnce(new NFStudioRequestError(statusText, status));

        // exercise && verify
        await expect(helioApiGETRequest({ path })).rejects.toThrowError(
            new TransactionValidationError(statusText, status)
        );
        expect(customFetchMock).toHaveBeenNthCalledWith(1, expected);
    });

    it('should throw received error if not NFStudio Error', async () => {
        // setup
        const statusText = 'message';
        const path = 'some/path';
        const expected = {
            retries: 1,
            options: {
                url: `${process.env.HELIO_API_ENDPOINT}/${path}?publicKey=${process.env.HELIO_PUBLIC_API_KEY}`,
                init: {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json;',
                        Authorization: `Bearer ${process.env.HELIO_SECRET_API_KEY}`
                    }
                }
            }
        };
        customFetchMock.mockRejectedValueOnce(new Error(statusText));

        // exercise && verify
        await expect(helioApiGETRequest({ path })).rejects.toThrowError(new Error(statusText));
        expect(customFetchMock).toHaveBeenNthCalledWith(1, expected);
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
