import { sqliteTable, text, integer, primaryKey, foreignKey } from 'drizzle-orm/sqlite-core';
import type { SupportedCurrencies } from '../src/server/service/data/types';

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
    paylinkId: text('paylink_id').notNull().unique(),
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
        symbol: text('symbol').$type<SupportedCurrencies>(),
        decimals: integer('decimals').notNull(),
        address: text('address').notNull()
    },
    table => ({
        pk: primaryKey({ columns: [table.chain, table.name] })
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

// Refunds Table
export const refunds = sqliteTable(
    'refunds',
    {
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
        chain: text('chain')
            .notNull()
            .references(() => chains.name),
        currency: text('currency').$type<SupportedCurrencies>().notNull()
    },
    table => ({
        currency_fk: foreignKey({
            columns: [table.chain, table.currency], // Composite foreign key
            foreignColumns: [currencies.chain, currencies.symbol] // Matches the composite primary key of currencies
        })
    })
);
