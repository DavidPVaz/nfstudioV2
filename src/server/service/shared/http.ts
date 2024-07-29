export class NFStudioRequestError extends Error {
    code;

    constructor(message: string, code: number) {
        super(message);
        this.code = code;
    }
}

type RequestOptions = {
    url: string;
    init: RequestInit;
    data?: Record<string, unknown>;
};

interface HttpRequest {
    retries: number;
    options: RequestOptions;
}

/**
 * Performs a HTTP request;
 *
 * @param {HttpRequest} data - request options
 * @param {HttpRequest['retries']} data.retries - the number of times to retry the request
 * @param {HttpRequest['options']} data.options - the request options
 */
export function customFetch<T>({
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
    }).then(response => {
        if (response.ok) {
            return response.json() as Promise<T>;
        }

        if (retries > 0) {
            return customFetch<T>({
                retries: --retries,
                options: { url, init: { method, headers }, data }
            });
        }

        throw new NFStudioRequestError(response.statusText, response.status);
    });
}
