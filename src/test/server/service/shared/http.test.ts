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
        vi.clearAllMocks();
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
        expect(fetchMock).toHaveBeenCalledWith(
            ...getExpectedFetchArguments({
                url,
                method,
                headers,
                data
            })
        );
        expect(fetchMock).toHaveBeenCalledOnce();
        expect(result).toEqual(responseData);
    });

    it('should retry a HTTP request', async () => {
        // setup
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
        const result = await customFetch(requestData);

        // verify
        expect(fetchMock).toHaveBeenCalledWith(
            ...getExpectedFetchArguments({
                url,
                method,
                headers,
                data
            })
        );
        expect(fetchMock).toHaveBeenCalledTimes(retries + 1);
        expect(result).toEqual(responseData);
    });

    it('should throw NFStudioRequestError on failed request', async () => {
        // setup
        const retries = 1;
        const url = 'url';
        const method = 'POST';
        const headers = { custom: 'header' };
        const data = { dummy: 'data' };
        const statusText = 'potato';
        const status = 500;

        const requestData = {
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
        await expect(customFetch(requestData)).rejects.toThrowError(
            new NFStudioRequestError(statusText, status)
        );
        expect(fetchMock).toHaveBeenCalledWith(
            ...getExpectedFetchArguments({
                url,
                method,
                headers,
                data
            })
        );
        expect(fetchMock).toHaveBeenCalledTimes(retries + 1);
    });
});
