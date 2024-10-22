import { describe, expect, vi, afterEach, it } from 'vitest';
import {
    isWithinWindow,
    helioApiGETRequest,
    HelioApiRequestError,
    TransactionValidationError
} from '@/server/service/helio/core';
import { NFStudioRequestError } from '@/server/service/shared/http';

const { customFetchMock } = vi.hoisted(() => ({
    customFetchMock: vi.fn()
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

    it('should correctly assert a timestamp is within an expected minutes window', () => {
        // setup
        vi.useFakeTimers();
        const date4MinutesAgo = new Date(new Date().getTime() - 4 * 60000).toISOString();

        // exercise && verify
        expect(isWithinWindow({ createdAt: date4MinutesAgo, minutes: 3.99 })).toBe(false);
        expect(isWithinWindow({ createdAt: date4MinutesAgo, minutes: 4 })).toBe(true);
        expect(isWithinWindow({ createdAt: date4MinutesAgo, minutes: 5 })).toBe(true);

        // cleanup
        vi.useRealTimers();
    });
});
