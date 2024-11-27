export const SUPPORTED_CURRENCIES = {
    SOL: 'SOL',
    USDC: 'USDC',
    USDT: 'USDT',
    JUP: 'JUP',
    Bonk: 'Bonk'
} as const;

export type SupportedCurrencies = (typeof SUPPORTED_CURRENCIES)[keyof typeof SUPPORTED_CURRENCIES];
