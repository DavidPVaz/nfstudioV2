type TokenQuoteMeta = {
    from: string;
    fromAmountDecimal: string;
    to: string;
    toAmountMinimal: string;
};
type PaymentRequestType = 'PAYLINK' | 'PAYSTREAM';
type TransactionType = 'REFUND' | 'PAYLINK';
type TransactionStatus = 'INITIATED' | 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELED' | 'SETTLED';

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
        symbol: string;
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
    verified: boolean;
    refunded: boolean;
    _id: Transaction['meta']['transactionSignature'];
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
    verified: boolean;
    refunded: boolean;
    _id: Transaction['meta']['transactionSignature'];
    statusToken: string;
    createdAt: Transaction['createdAt'];
    canDelete?: boolean;
};
