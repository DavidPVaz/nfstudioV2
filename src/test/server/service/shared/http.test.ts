/* eslint-disable @typescript-eslint/no-floating-promises */
import { describe, expect, vi, afterEach, it } from 'vitest';
import { customFetch, NFStudioRequestError } from '@/server/service/shared/http';

const { fetchMock } = vi.hoisted(() => ({
    fetchMock: vi.fn()
}));

const getExpectedFetchArguments = ({
    url,
    method,
    headers,
    data
}: {
    url: string;
    method: string;
    headers?: Record<string, string>;
    data?: Record<string, unknown>;
}) => [
    url,
    {
        method,
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(data)
    }
];

describe('server/service/shared/http', () => {
    global.fetch = fetchMock;

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should perform a HTTP request and retrieve the JSON response', async () => {
        // setup
        const url = 'url';
        const method = 'GET';
        const headers = { custom: 'header' };
        const data = undefined;

        const requestData = {
            retries: 0,
            options: {
                url,
                init: { method, headers },
                data
            }
        };
        const responseData = { data: 'data' };
        fetchMock.mockImplementationOnce(() =>
            Promise.resolve({ ok: true, json: () => Promise.resolve(responseData) })
        );

        // exercise
        const result = await customFetch(requestData);

        // verify
        expect(result).toEqual(responseData);
        expect(fetchMock).toHaveBeenNthCalledWith(
            1,
            ...getExpectedFetchArguments({
                url,
                method,
                headers,
                data
            })
        );
    });

    it('should retry a HTTP request', async () => {
        // setup
        vi.useFakeTimers();
        const retries = 3;
        const url = 'url';
        const method = 'POST';
        const headers = { custom: 'header' };
        const data = { dummy: 'data' };

        const requestData = {
            retries,
            options: {
                url,
                init: { method, headers },
                data
            }
        };
        const responseData = { data: 'data' };
        fetchMock.mockImplementationOnce(() => Promise.resolve({ ok: false })); // first call
        fetchMock.mockImplementationOnce(() => Promise.resolve({ ok: false })); // first retry
        fetchMock.mockImplementationOnce(() => Promise.resolve({ ok: false })); // second retry
        fetchMock.mockImplementationOnce(() =>
            Promise.resolve({ ok: true, json: () => Promise.resolve(responseData) })
        ); // third retry

        // exercise
        const start = Date.now();
        vi.runAllTimersAsync();
        const result = await customFetch(requestData);
        const timeElapsed = Date.now() - start;

        // verify
        expect(result).toEqual(responseData);
        expect(fetchMock).toHaveBeenNthCalledWith(
            retries + 1,
            ...getExpectedFetchArguments({
                url,
                method,
                headers,
                data
            })
        );
        expect(timeElapsed).toEqual(retries * 1000);

        // cleanup
        vi.useRealTimers();
    });

    it('should throw NFStudioRequestError on failed request', async () => {
        // setup
        vi.useFakeTimers();
        const retryDelay = 5000;
        const retries = 1;
        const url = 'url';
        const method = 'POST';
        const headers = { custom: 'header' };
        const data = { dummy: 'data' };
        const statusText = 'potato';
        const status = 500;

        const requestData = {
            retryDelay,
            retries,
            options: {
                url,
                init: { method, headers },
                data
            }
        };
        fetchMock.mockImplementationOnce(() => Promise.resolve({ ok: false, statusText, status })); // first call
        fetchMock.mockImplementationOnce(() => Promise.resolve({ ok: false, statusText, status })); // first retry

        // exercise && verify
        const start = Date.now();
        vi.runAllTimersAsync();
        await expect(customFetch(requestData)).rejects.toThrowError(
            new NFStudioRequestError(statusText, status)
        );
        const timeElapsed = Date.now() - start;

        expect(fetchMock).toHaveBeenNthCalledWith(
            retries + 1,
            ...getExpectedFetchArguments({
                url,
                method,
                headers,
                data
            })
        );
        expect(timeElapsed).toEqual(retries * retryDelay);

        // cleanup
        vi.useRealTimers();
    });

    it('should not retry if first response status is a client error', async () => {
        // setup
        const NON_RETRIABLE_CLIENT_ERROR_CODES = [400, 401, 403, 404, 409];
        const retries = 1;
        const url = 'url';
        const method = 'POST';
        const headers = { custom: 'header' };
        const data = { dummy: 'data' };
        const statusText = 'potato';

        const requestData = {
            retries,
            options: {
                url,
                init: { method, headers },
                data
            }
        };
        NON_RETRIABLE_CLIENT_ERROR_CODES.forEach(status =>
            fetchMock.mockImplementationOnce(() =>
                Promise.resolve({ ok: false, statusText, status })
            )
        );

        // exercise && verify
        for (const status of NON_RETRIABLE_CLIENT_ERROR_CODES) {
            await expect(customFetch(requestData)).rejects.toThrowError(
                new NFStudioRequestError(statusText, status)
            );
        }
        expect(fetchMock).toHaveBeenNthCalledWith(
            NON_RETRIABLE_CLIENT_ERROR_CODES.length,
            ...getExpectedFetchArguments({
                url,
                method,
                headers,
                data
            })
        );
    });
});
