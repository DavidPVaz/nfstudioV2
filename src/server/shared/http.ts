type RequestOptions = {
    url: string;
    init: RequestInit;
    data?: Record<string, unknown>;
};

interface HttpRequest {
    retries: number;
    options: RequestOptions;
    onError?: (message: string, code: number) => Error;
}

/**
 * Performs a HTTP request;
 *
 * @param {HttpRequest} data - request options
 * @param {HttpRequest['retries']} [data.retries] - the number of times to retry the request
 * @param {HttpRequest['options']} data.options - the request options
 * @param {HttpRequest['onError']} [data.options] - on http error handler
 *
 * @returns {Promise<T>} the response data
 * @throws {Error} if request fails
 */
export function customFetch<T>({
    retries,
    options: {
        url,
        init: { method, headers },
        data
    },
    onError
}: HttpRequest): Promise<T> {
    return fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(data)
    }).then(response => {
        if (response.ok) {
            return response.json() as Promise<T>;
        }

        if (retries > 0) {
            return customFetch<T>({
                retries: --retries,
                options: { url, init: { method, headers }, data },
                onError
            });
        }

        throw onError?.(response.statusText, response.status) ?? new Error(response.statusText);
    });
}

// TODO: tests
