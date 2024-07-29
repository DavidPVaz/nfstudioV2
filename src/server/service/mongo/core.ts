import 'server-only';

import { NFStudioRequestError, customFetch } from '@/server/service/shared/http';
import { type Chain, type Platform, type Option } from '@/shared/enums';

export class MongoDataApiRequestError extends NFStudioRequestError {
    constructor(message: string, code: number) {
        super(message, code);
        this.name = 'MongoDataApiRequestError';
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

export type CollectionConfiguration = {
    _id: string;
    chain: Chain;
    presentation: string;
    marketplace: string;
    discord: string;
    twitter: string;
    website?: string;
    createdAt?: string;
    active?: boolean;
    config?: {
        cacheStrategy: { sMaxAge: number; maxAge: number } | {};
        logos: Array<string>;
        unsupportedTraits: { [key: string]: Array<string> } | {};
        paylinkId: string;
    };
};
export type CollectionMetadata = {
    _id: number;
    uri: string;
};
export type TransactionData = {
    _id: string;
    refunded: boolean;
    verified: boolean;
    paylinkId: string;
    statusToken: string;
    helioTransactionId: string;
    createdAt: string;
    clientPublicKey: string;
    amount: string;
    currency: {
        decimals: number;
        mintAddress: string;
        symbol: string; // TODO: change for enum type when transactions are included
    };
    purchaseDetails: {
        collection: string;
        creationOptions: {
            src: string;
            width: number;
            height: number;
            dpi: number;
            platform: Platform;
            option: Option;
            atRight: boolean;
            coverStyle: boolean;
            logo?: string;
        };
    };
    associatedRefundTransactionSignature: string;
};

type MongoResponse<T> = {
    documents: T;
};

export type MongoDocument = Record<string, unknown>;
export type MongoFilter = Record<string, Record<string, boolean | number[]>>;
export type MongoSort = Record<string, number | string>;
export type MongoLimit = number | null;
export type MongoProjection = Record<string, number>;
export type MongoUpdate = Record<string, Record<string, unknown>>;
export type MongoPostData = {
    database: NFStudioDatabase;
    collection: string;
    document?: MongoDocument;
    filter?: MongoFilter;
    sort?: MongoSort;
    limit?: MongoLimit;
    projection?: MongoProjection;
    update?: MongoUpdate;
};

interface MongoApiRequest {
    action: Action;
    data: MongoPostData;
    retries?: number;
}

/**
 * Maps Access type with an api key.
 */
const ACCESS_KEY = {
    APP: process.env.MONGO_API_KEY_READ as string,
    ADMIN: process.env.MONGO_API_KEY_WRITE as string
};

/**
 * Performs a request to MongoDB api.
 */
export async function mongoApiRequest<T>({ action, data, retries = 1 }: MongoApiRequest) {
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
