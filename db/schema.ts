import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import type { SupportedCurrencies } from '../src/server/service/db/types';

// Collections Table
export const collections = sqliteTable('collections', {
    name: text('name').primaryKey(),
    chain: text({ enum: ['Solana', 'Ethereum', 'Polygon', 'Optimism', 'Arbitrum'] }).notNull(),
    presentationPictureUrl: text('presentation_picture_url').notNull(),
    marketplaceUrl: text('marketplace_url').notNull(),
    discordUrl: text('discord_url').notNull(),
    twitterUrl: text('twitter_url').notNull(),
    websiteUrl: text('website_url'),
    createdAt: text('created_at').notNull(),
    active: integer('active', { mode: 'boolean' }).default(true),
    paylinkId: text('paylink_id').notNull().unique(),
    cacheStrategySMaxAge: integer('cache_strategy_sMaxAge'),
    cacheStrategyMaxAge: integer('cache_strategy_maxAge')
});

// Logos Table
export const logos = sqliteTable('logos', {
    url: text('url').primaryKey(),
    collection: text('collection')
        .notNull()
        .references(() => collections.name)
});

// NFT Metadata Table
export const nftMetadata = sqliteTable(
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
export const unsupportedTraits = sqliteTable(
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

// Currencies Table
export const currencies = sqliteTable('currencies', {
    symbol: text('symbol').$type<SupportedCurrencies>().primaryKey(),
    mintAddress: text('mint_address').notNull().unique(),
    decimals: integer('decimals').notNull()
});

// Refunds Table
export const refunds = sqliteTable('refunds', {
    id: text('id').primaryKey(),
    refunded: integer('refunded', { mode: 'boolean' }).default(false),
    verified: integer('verified', { mode: 'boolean' }).default(false),
    canDelete: integer('canDelete', { mode: 'boolean' }),
    createdAt: text('created_at').notNull(),
    paylinkId: text('paylink_id').references(() => collections.paylinkId),
    helioTransactionId: text('helio_transaction_id').unique(),
    clientPublicKey: text('client_public_key'),
    amount: text('amount'),
    transactionSignature: text('transaction_signature'),
    currency: text('currency')
        .$type<SupportedCurrencies>()
        .references(() => currencies.symbol)
});
export type Refund = typeof refunds.$inferInsert;
