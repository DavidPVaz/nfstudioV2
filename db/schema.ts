import { sqliteTable, text, integer, primaryKey, foreignKey, index } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';

// Chains Table
export const chains = sqliteTable('chains', {
    name: text('name').primaryKey()
});

// Collections Table
export const collections = sqliteTable('collections', {
    name: text('name').primaryKey(),
    chain: text('chain')
        .notNull()
        .references(() => chains.name),
    presentationPictureUrl: text('presentation_picture_url').notNull(),
    marketplaceUrl: text('marketplace_url').notNull(),
    discordUrl: text('discord_url').notNull(),
    twitterUrl: text('twitter_url').notNull(),
    websiteUrl: text('website_url'),
    createdAt: text('created_at').notNull(),
    active: integer('active', { mode: 'boolean' }).default(true),
    paylinkId: text('paylink_id').unique(),
    cacheStrategySMaxAge: integer('cache_strategy_sMaxAge'),
    cacheStrategyMaxAge: integer('cache_strategy_maxAge')
});

// Currencies Table
export const currencies = sqliteTable(
    'currencies',
    {
        chain: text('chain')
            .notNull()
            .references(() => chains.name),
        name: text('name').notNull(),
        symbol: text('symbol').notNull(),
        decimals: integer('decimals').notNull(),
        address: text('address').notNull()
    },
    table => ({
        pk: primaryKey({ columns: [table.chain, table.symbol] })
    })
);

// Logos Table
export const logos = sqliteTable('logos', {
    url: text('url').primaryKey(),
    collection: text('collection')
        .notNull()
        .references(() => collections.name)
});

// NFT Metadata Table
export const nft_metadata = sqliteTable(
    'nft_metadata',
    {
        collection: text('collection')
            .notNull()
            .references(() => collections.name),
        nftId: integer('nft_id').notNull(),
        uri: text('uri').notNull()
    },
    table => ({
        pk: primaryKey({ columns: [table.collection, table.nftId] })
    })
);

// Unsupported Traits Table
export const unsupported_traits = sqliteTable(
    'unsupported_traits',
    {
        collection: text('collection')
            .notNull()
            .references(() => collections.name),
        traitType: text('trait_type').notNull(),
        value: text('value').notNull()
    },
    table => ({
        pk: primaryKey({ columns: [table.collection, table.traitType, table.value] })
    })
);

// Refunds Table
export const refunds = sqliteTable(
    'refunds',
    {
        id: text('id').primaryKey(),
        refunded: integer('refunded', { mode: 'boolean' }).default(false),
        verified: integer('verified', { mode: 'boolean' }).default(false),
        canDelete: integer('can_delete', { mode: 'boolean' }),
        createdAt: text('created_at').notNull(),
        paylinkId: text('paylink_id'),
        helioTransactionId: text('helio_transaction_id').unique(),
        clientPublicKey: text('client_public_key'),
        amount: text('amount'),
        associatedRefundTransactionSignature: text('associated_refund_transaction_signature'),
        chain: text('chain'),
        currency: text('currency')
    },
    table => ({
        currency_fk: foreignKey({
            columns: [table.chain, table.currency], // Composite foreign key
            foreignColumns: [currencies.chain, currencies.symbol] // Matches the composite primary key of currencies
        }),
        verifiedRefundTransactionsIndex: index('verified_refund_transactions_index')
            .on(table.verified, table.refunded, table.associatedRefundTransactionSignature)
            .where(
                sql`refunds.verified = true AND refunds.refunded = false and associated_refund_transaction_signature = null`
            ),
        unverifiedRefundTransactionsIndex: index('unverified_refund_transactions_index')
            .on(table.verified, table.canDelete)
            .where(sql`refunds.verified = false AND refunds.can_delete = null`),
        flaggedForDeletionIndex: index('flagged_for_deletion_index')
            .on(table.canDelete)
            .where(sql`refunds.can_delete = true`)
    })
);

// Drizzle require both ways to be mapped, otherwise cannot infer

// Define many relationship for chains
export const chainsRelations = relations(chains, ({ many }) => ({
    collections: many(collections), // one chain -> many collections - A
    currencies: many(currencies) // one chain -> many currencies - B
}));

// Define many relationship for collections
export const collectionsRelations = relations(collections, ({ many }) => ({
    logos: many(logos), // one collection -> many logos - C
    nftMetadata: many(nft_metadata), // one collection -> many nft metadata - D
    unsupportedTraits: many(unsupported_traits) // one collection -> many unsupported traits - E
}));

// Define many relationship for currencies
export const currenciesRelations = relations(currencies, ({ many }) => ({
    refunds: many(refunds) // one currency -> many refunds - F
}));

// Inverse

// F
export const refundsToCurrency = relations(refunds, ({ one }) => ({
    currency: one(currencies, {
        fields: [refunds.chain, refunds.currency],
        references: [currencies.chain, currencies.symbol]
    })
}));

// E
export const unsupportedTraitsToCollection = relations(unsupported_traits, ({ one }) => ({
    collection: one(collections, {
        fields: [unsupported_traits.collection],
        references: [collections.name]
    })
}));

// D
export const nftMetadataToCollection = relations(nft_metadata, ({ one }) => ({
    collection: one(collections, {
        fields: [nft_metadata.collection],
        references: [collections.name]
    })
}));

// C
export const logosToCollection = relations(logos, ({ one }) => ({
    collection: one(collections, {
        fields: [logos.collection],
        references: [collections.name]
    })
}));

// B
export const currencyToChain = relations(currencies, ({ one }) => ({
    chain: one(chains, {
        fields: [currencies.chain],
        references: [chains.name]
    })
}));

// A
export const collectionToChain = relations(collections, ({ one }) => ({
    chain: one(chains, {
        fields: [collections.chain],
        references: [chains.name]
    })
}));
