export class NFStudioRequestError extends Error {
    code;

    constructor(message: string, code: number) {
        super(message);
        this.code = code;
    }
}

type RequestOptions = {
    url: string | URL;
    init: RequestInit;
    data?: Record<string, unknown>;
};

interface HttpRequest {
    retryDelay?: number;
    retries: number;
    options: RequestOptions;
}

const NON_RETRIABLE_CLIENT_ERROR_CODES = [400, 401, 403, 404, 409];

/**
 * Performs a HTTP request.
 *
 * @param {HttpRequest} data - request data
 * @param {HttpRequest['retryDelay']} [data.retryDelay] - the number of delay to retry the request in ms - defaults to 1000
 * @param {HttpRequest['retries']} data.retries - the number of times to retry the request
 * @param {HttpRequest['options']} data.options - the request options
 *
 * @throws {Error | NFStudioRequestError} if request failed
 */
export function customFetch<T>({
    retryDelay = 1000,
    retries,
    options: {
        url,
        init: { method, headers },
        data
    }
}: HttpRequest): Promise<T> {
    return fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(data)
    }).then(async response => {
        if (response.ok) {
            return response.json() as Promise<T>;
        }

        if (retries === 0 || NON_RETRIABLE_CLIENT_ERROR_CODES.includes(response.status)) {
            throw new NFStudioRequestError(response.statusText, response.status);
        }

        await new Promise(resolve => setTimeout(resolve, retryDelay));

        return customFetch<T>({
            retries: --retries,
            options: { url, init: { method, headers }, data }
        });
    });
}
