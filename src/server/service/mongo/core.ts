import { NFStudioRequestError, customFetch } from '@/server/service/shared/http';
import { type Action, MongoPostData, ACTIONS } from './types';
export class MongoDataApiRequestError extends NFStudioRequestError {
    constructor(message: string, code: number) {
        super(message, code);
        this.name = 'MongoDataApiRequestError';
    }
}

type MongoResponse<T> = {
    documents: T[];
};

type MongoApiRequest<T> = {
    action: Action;
    data: MongoPostData<T>;
    retries?: number;
};

/**
 * Maps Access type with an api key.
 */
const ACCESS_KEY = {
    APP: process.env.MONGO_API_KEY_READ!,
    ADMIN: process.env.MONGO_API_KEY_WRITE!
};

/**
 * Performs a POST request to MongoDB data api.
 *
 * @param data - mongo api request data
 * @param data.action - action type to perform in this request
 * @param data.data - the request data
 * @param [data.retries] - number of times to retry this request
 *
 * @throws {Error | MongoDataApiRequestError} if request failed
 */
export async function mongoApiRequest<T>({ action, data, retries = 1 }: MongoApiRequest<T>) {
    try {
        return await customFetch<MongoResponse<T>>({
            retries,
            options: {
                url: `${process.env.MONGO_API}/${action}`,
                init: {
                    method: 'POST',
                    headers: {
                        'api-key': action === ACTIONS.FIND ? ACCESS_KEY.APP : ACCESS_KEY.ADMIN
                    }
                },
                data: { ...data, dataSource: 'nfstudio' }
            }
        });
    } catch (error) {
        if (error instanceof NFStudioRequestError) {
            throw new MongoDataApiRequestError(error.message, error.code);
        }

        throw error;
    }
}
