import { customFetch } from '@/server/shared/http';

export class MongoDataApiRequestError extends Error {
    code;

    constructor(message: string, code: number) {
        super(message);
        this.name = 'MongoDataApiRequestError';
        this.code = code;
    }
}

export const DATABASES = {
    COLLECTIONS: 'collections',
    METADATA: 'metadata',
    REFUNDS: 'refunds'
} as const;
export type NFStudioDatabase = (typeof DATABASES)[keyof typeof DATABASES];

export const ACTIONS = {
    FIND: 'find',
    INSERT_ONE: 'insertOne',
    UPDATE_MANY: 'updateMany',
    UPDATE_ONE: 'updateOne',
    DELETE_MANY: 'deleteMany'
} as const;
export type Action = (typeof ACTIONS)[keyof typeof ACTIONS];

export const ACCESS_TYPES = {
    APP: 'app',
    ADMIN: 'admin'
} as const;
export type Access = (typeof ACCESS_TYPES)[keyof typeof ACCESS_TYPES];

// TODO: define all these types. possible data returning from mongo nfstudio database
type NFStudioCollectionsData = Record<string, unknown>[];
type NFStudioCollectionMetadata = Record<string, unknown>[];
type NFStudioTransactionData = Record<string, unknown>[];

type MongoResponse<T> = {
    documents: T;
};

export type MongoDocument = Record<string, unknown>;
export type MongoFilter = Record<string, Record<string, boolean | number[]>>;
export type MongoSort = Record<string, number | string>;
export type MongoLimit = number | null;
export type MongoProjection = Record<string, number>;
export type MongoUpdate = Record<string, Record<string, unknown>>;

interface MongoApiRequest {
    access: Access;
    action: Action;
    data: {
        database: NFStudioDatabase;
        collection: string;
        document?: MongoDocument;
        filter?: MongoFilter;
        sort?: MongoSort;
        limit?: MongoLimit;
        projection?: MongoProjection;
        update?: MongoUpdate;
    };
    retries?: number;
}

/**
 * Maps Access type with an api key.
 */
const ACCESS_KEY = {
    [ACCESS_TYPES.APP]: process.env.MONGO_API_KEY_READ as string,
    [ACCESS_TYPES.ADMIN]: process.env.MONGO_API_KEY_WRITE as string
} as const;

/**
 * Performs a request to MongoDB api.
 */
export function mongoApiRequest<T>({ access, action, data, retries = 0 }: MongoApiRequest) {
    return customFetch<MongoResponse<T>>({
        retries,
        options: {
            url: `${process.env.MONGO_API}/${action}`,
            init: { method: 'POST', headers: { 'api-key': ACCESS_KEY[access] } },
            data: { ...data, dataSource: 'nfstudio' }
        },
        onError: (message, code) => new MongoDataApiRequestError(message, code)
    });
}

// TODO: tests
