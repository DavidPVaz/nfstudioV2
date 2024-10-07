type TokenQuoteMeta = {
    from: string;
    fromAmountDecimal: string;
    to: string;
    toAmountMinimal: string;
};
type PaymentRequestType = 'PAYLINK' | 'PAYSTREAM';
type TransactionType = 'REFUND' | 'PAYLINK';
type TransactionStatus = 'INITIATED' | 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELED' | 'SETTLED';

/**
 * Supported currency symbols
 */
export const SUPPORTED_CURRENCIES = {
    SOL: 'SOL',
    USDC: 'USDC',
    USDT: 'USDT',
    JUP: 'JUP',
    Bonk: 'Bonk'
} as const;

type SupportedCurrencySymbol = (typeof SUPPORTED_CURRENCIES)[keyof typeof SUPPORTED_CURRENCIES];

type TransactionMeta = {
    id: string;
    transactionSignature: string; // transaction hash on the blockchain
    amount: string;
    recipientPK: string; // merchant's public key (wallet address)
    senderPK: string; // customer's public key (wallet address)
    customerDetails: {
        email?: string;
        discordUsername?: string;
        discordUser?: {
            id: string;
            username: string;
        };
        twitterUsername?: string;
        fullName?: string;
        country?: string;
        deliveryAddress?: string;
        phoneNumber?: string;
        street?: string;
        streetNumber?: string;
        city?: string;
        state?: string;
        areaCode?: string;
        additionalJSON?: string;
    };
    totalAmount: string;
    affiliateAmount: string;
    affiliateCode?: string;
    affiliatePublicKey?: string;
    currency: {
        decimals: number;
        mintAddress: string;
        symbol: SupportedCurrencySymbol;
    };
    transactionType?: TransactionType;
    tokenQuote: TokenQuoteMeta;
    transactionStatus: TransactionStatus;
};

export type StatusTokenPayload = {
    transactionId: Transaction['id'];
    transactionSignature: Transaction['meta']['transactionSignature'];
    exp: number;
};

export type Transaction = {
    id: string;
    paylinkId: string;
    quantity: number;
    fee: string;
    createdAt: string;
    paymentType: PaymentRequestType;
    meta: TransactionMeta;
};

export type PurchaseDetails = {
    src: string;
    width: number;
    height: number;
    atRight: boolean;
    coverStyle: boolean;
    mobile: boolean;
    logoSrc?: string;
    dpi: number;
    collection: string;
};

export type NFStudioVerifiedRefundTransaction = {
    _id: Transaction['meta']['transactionSignature'];
    verified: boolean;
    refunded: boolean;
    paylinkId: Transaction['paylinkId'];
    statusToken: string;
    helioTransactionId: Transaction['id'];
    createdAt: Transaction['createdAt'];
    clientPublicKey: Transaction['meta']['senderPK'];
    amount: string;
    currency: Transaction['meta']['currency'];
    purchaseDetails: PurchaseDetails;
    associatedRefundTransactionSignature?: Transaction['meta']['transactionSignature'];
};

export type NFStudioUnverifiedRefundTransaction = {
    _id: Transaction['meta']['transactionSignature'];
    verified: boolean;
    refunded: boolean;
    statusToken: string;
    createdAt: Transaction['createdAt'];
    canDelete?: boolean;
};
