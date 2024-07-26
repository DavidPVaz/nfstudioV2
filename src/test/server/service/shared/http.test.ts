import { describe, expect, vi, afterEach, it } from 'vitest';
import { customFetch } from '@/server/service/shared/http';

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

    it('should perform a HTTP request and retrieve the response JSON', async () => {
        // setup
        const url = 'url';
        const method = 'GET';
        const headers = { custom: 'header' };
        const data = undefined;

        const requestData = {
            retries: 2,
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
        fetchMock.mockImplementationOnce(() => Promise.resolve({ ok: false }));
        fetchMock.mockImplementationOnce(() => Promise.resolve({ ok: false }));
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
        expect(fetchMock).toHaveBeenCalledTimes(retries);
        expect(result).toEqual(responseData);
    });

    it('should throw a generic Error on failed request', async () => {
        // setup
        const retries = 3;
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
        fetchMock.mockImplementation(() => Promise.resolve({ ok: false, statusText }));

        // exercise && verify
        await expect(customFetch(requestData)).rejects.toThrowError(Error(statusText));

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

    it('should throw the provided custom Error on failed request', async () => {
        // setup
        class CustomError extends Error {
            constructor(message: string, code: number) {
                super(message);
            }
        }
        const retries = 1;
        const url = 'url';
        const method = 'POST';
        const headers = { custom: 'header' };
        const data = { dummy: 'data' };
        const statusText = 'potato';
        const status = 400;
        const onErrorThrow = vi
            .fn()
            .mockImplementationOnce(
                (statusText: string, status: number) => new CustomError(statusText, status)
            );

        const requestData = {
            retries,
            options: {
                url,
                init: { method, headers },
                data
            },
            onErrorThrow
        };
        fetchMock.mockImplementation(() => Promise.resolve({ ok: false, statusText, status }));

        // exercise && verify
        await expect(customFetch(requestData)).rejects.toThrowError(
            new CustomError(statusText, status)
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
        expect(onErrorThrow).toHaveBeenCalledOnce();
        expect(onErrorThrow).toHaveBeenCalledWith(statusText, status);
    });
});
