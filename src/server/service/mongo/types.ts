import { type Chain, type Platform, type Option } from '@/shared/enums';

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
    config: {
        cacheStrategy: { sMaxAge: number; maxAge: number } | object;
        logos: string[];
        unsupportedTraits: Record<string, string[]> | object;
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

export type MongoDocument = Record<string, unknown>;
export type MongoFilter = Record<string, Record<string, boolean | number[] | string>>;
export type MongoSort = Record<string, number | string>;
export type MongoLimit = number | null;
export type MongoProjection<T> = Record<keyof T, 0 | 1> | object;
export type MongoUpdate = Record<string, Record<string, unknown>>;
export type MongoPostData<T> = {
    database: NFStudioDatabase;
    collection: string;
    document?: MongoDocument;
    filter?: MongoFilter;
    sort?: MongoSort;
    limit?: MongoLimit;
    projection?: MongoProjection<T>;
    update?: MongoUpdate;
};
