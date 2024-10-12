import { decodeToken, jwtHasExpired } from '@/server/service/auth';
import { NFStudioRequestError, customFetch } from '@/server/service/shared/http';
import type { StatusTokenPayload } from '@/server/service/helio/types';

export class HelioApiRequestError extends NFStudioRequestError {
    constructor(message: string, code: number) {
        super(message, code);
        this.name = 'HelioApiRequestError';
    }
}

export class TransactionValidationError extends NFStudioRequestError {
    constructor(message: string, code: number) {
        super(message, code);
        this.name = 'TransactionValidationError';
    }
}

type HelioApiGetRequest = {
    path: string;
    retries?: number;
};

/**
 * Performs a GET request to Helio api.
 *
 * @param data
 * @param data.path - url path
 * @param data.retries - number of times to retry this request
 *
 * @throws {Error | HelioApiRequestError | TransactionValidationError} if request failed
 */
export async function helioApiGETRequest<T>({ path, retries = 1 }: HelioApiGetRequest) {
    try {
        return await customFetch<T>({
            retries,
            options: {
                url: `${process.env.HELIO_API_ENDPOINT}/${path}?publicKey=${process.env.HELIO_PUBLIC_API_KEY}`,
                init: {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${process.env.HELIO_SECRET_API_KEY}`
                    }
                }
            }
        });
    } catch (error) {
        if (error instanceof NFStudioRequestError) {
            const SpecificError =
                // if the response code from HELIO api call are 401 || 404, it means it was not a transaction from NFStudio, which is invalid
                error.code === 401 || error.code === 404
                    ? TransactionValidationError
                    : HelioApiRequestError;

            throw new SpecificError(error.message, error.code);
        }

        throw error;
    }
}

/**
 * Asserts wether a timestamp is within now and the provided interval.
 *
 * @param options
 * @param options.createdAt - timestamp
 * @param options.minutes - the number of minutes to assert for
 */
const isWithinWindow = ({ createdAt, minutes }: { createdAt: string; minutes: number }) =>
    createdAt >= new Date(new Date().getTime() - minutes * 60000).toISOString() &&
    createdAt <= new Date().toISOString();

/**
 * Validate the authenticity of a blockchain transaction.
 *
 * @param options
 * @param options.payloadTx - the transaction signature to verify received via NFStudio API call
 * @param options.fetchedTx - the transaction signature fetched via own HELIO API call, theoretically equal to the received one
 * @param options.id - the transaction id of this transaction signature fetched from Helio
 * @param options.statusToken - the JWT token to be decoded that includes the transaction signature and its id
 * @param options.createdAt - time at which the transaction was created
 * @param options.ignoreTxTime - wether to ignore the time at which transaction took place
 */
export const isValidTransaction = ({
    payloadTx,
    fetchedTx,
    id,
    statusToken,
    createdAt,
    ignoreTxTime
}: {
    payloadTx: string;
    fetchedTx: string;
    id: string;
    statusToken: string;
    createdAt: string;
    ignoreTxTime: boolean;
}) => {
    const { transactionSignature, transactionId, exp } =
        decodeToken<StatusTokenPayload>(statusToken);

    if (!transactionSignature || !transactionId) {
        return false;
    }

    const isValid =
        payloadTx === transactionSignature &&
        fetchedTx === transactionSignature &&
        id === transactionId;

    if (ignoreTxTime) {
        return isValid;
    }

    return isValid && !jwtHasExpired(exp) && isWithinWindow({ createdAt, minutes: 3 });
};
