import * as schema from '../../../../db/schema';
import { ExtractTablesWithRelations } from 'drizzle-orm';

export type Logo = typeof schema.logos.$inferSelect;
export type NftMetadata = typeof schema.nft_metadata.$inferSelect;
export type UnsupportedTraits = typeof schema.unsupported_traits.$inferSelect;

export type Collection = typeof schema.collections.$inferSelect & {
    logos?: Logo[];
    nftMetadata?: NftMetadata[];
    unsupportedTraits?: UnsupportedTraits[];
};

export type CollectionRelation = ExtractTablesWithRelations<
    typeof schema
>['collections']['relations'];
export type CollectionManyRelation = Exclude<CollectionRelation, { chain: unknown }>;

export const SUPPORTED_CURRENCIES = {
    SOL: 'SOL',
    USDC: 'USDC',
    USDT: 'USDT',
    JUP: 'JUP',
    Bonk: 'Bonk'
} as const;

export type SupportedCurrencies = (typeof SUPPORTED_CURRENCIES)[keyof typeof SUPPORTED_CURRENCIES];
