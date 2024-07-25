export const CHAINS = {
    SOLANA: 'Solana',
    ETHEREUM: 'Ethereum',
    POLYGON: 'Polygon',
    OPTIMISM: 'Optimism'
} as const;
export type Chain = (typeof CHAINS)[keyof typeof CHAINS];

export const PAGES = {
    HOME: '/',
    FAQ: '/faq',
    COLLECTIONS: '/collections',
    TERMS_OF_SERVICE: '/terms-of-service.pdf',
    PRIVACY_POLICY: '/privacy-policy.pdf'
} as const;
export type Page = (typeof PAGES)[keyof typeof PAGES];

export const PLATFORMS = {
    SOCIAL_MEDIA: 'socialMedia',
    DESKTOP: 'desktop',
    MOBILE: 'mobile'
} as const;
export type Platform = (typeof PLATFORMS)[keyof typeof PLATFORMS];

export const OPTIONS = {
    TWITTER_BANNER: 'twitterBanner',
    FACEBOOK_BANNER: 'facebookBanner',
    YOUTUBE_BANNER: 'youtubeBanner',
    DESKTOP_HD: 'desktopHd',
    DESKTOP_FULL_HD: 'desktopFullHd',
    DESKTOP_2K: 'desktop2k',
    DESKTOP_4K: 'desktop4k',
    IPHONE_4: 'iphone4',
    IPHONE_5: 'iphone5',
    SAMSUNG_A5: 'samsungA5',
    IPHONE_678: 'iphone678',
    SAMSUNG_S5: 'samsungS5',
    IPHONE_678PLUS: 'iphone678Plus',
    IPHONE_X: 'iphoneX',
    SAMSUNG_S6: 'samsungS6',
    SAMSUNG_S8PLUS: 'samsungS8Plus'
} as const;
export type Option = (typeof OPTIONS)[keyof typeof OPTIONS];

export const WIZARD_PAGES = {
    SELECTION: 'selection',
    CONFIRM: 'confirm',
    CHECKOUT: 'checkout'
} as const;
export type WizardPage = (typeof WIZARD_PAGES)[keyof typeof WIZARD_PAGES];

export const GALLERY_IMAGES = {
    BANNER: [
        '5hxn7djhvTrJxWTXDxfQf5/8875063444cd006c8230089f39cfd159/banner1.webp',
        '6uAjAVAjhl9Bebyoq18aWC/9da84682da884edbe2a2add1c376f904/banner2.webp',
        '2MPTP9Qmp3C093nHhMoPKc/86b0c3adcba71a0dae83f44150fdd980/banner3.webp',
        '2KI1MMbfg2AiExHb8HfSSb/fb41fd5b800193ff576a3a4c8abe096f/banner4.webp',
        '6nPk46MqACPXb06mt3scU4/e2b94c44e36f8786b570a21ce7cc479d/banner5.webp',
        '6pROJlJ5rJbl8XmQXB21Dp/6946d56fb214bed69355ec4c1df641e2/banner6.webp',
        '36Qrxw9Dj4RRnouHfnAcSl/e6b640e05b3ad6be83e16c99b63af046/banner7.webp',
        '1fPsrrhhsWISelT4a6L596/0621d7f240224617674ada70b6faedd6/banner8.webp'
    ],
    DESKTOP: [
        '1c1JZa4i2Jb6tjj2vet0gM/147286007a1ba56e66ed98428ac4f94e/desktop1.webp',
        '2r1Q2FFWPRastEGikv5lNZ/59c07d009edba0470ae379c2de4a2316/desktop2.webp',
        '4KEdD92HpuzTb2mBLE9kgX/3b71b7ee7efb6358af82d9e67aa31a63/desktop3.webp',
        '6tU2h2csCsoFsHMmvMuiIV/a01d564fad6ef07250e71a3f4691c57b/desktop4.webp',
        '4YShR9VSxAcWhZGAjDdLar/5d63e6c995d09434b1540599ac97c03c/desktop5.webp',
        '37gp9lUN30BA5X8OjYlKZQ/c81b8857c7ce39f7ca2a3013d69ee52c/desktop6.webp',
        '46N1pbBP5fVjOJPGu7HpT/b56a2a4b7a62f713ed2620402b8c62d5/desktop7.webp',
        '4LKAJDDyeYfydkJQQvSQh1/1116a80cde8eaed73fb11823f44b37e7/desktop8.webp',
        '75yc1KgnH7cBDvutuUljSs/2426f9f9aa428a25b963d324bcb76ca8/desktop9.webp',
        '5843AxzHc8XWTOZVbLvboT/ab4dfac26d72fc9bd7ce844445304355/desktop10.webp',
        'EwAipF7sGFXV2OdYMMAjH/6e98c0048fda051801199383b2c4af70/desktop11.webp',
        '5anRPjxvQqRd4kZ15JPEEI/c547eca23b7d76e4221ca998c99e0d86/desktop12.webp'
    ],
    MOBILE: [
        '4Hcgkw4tB33VJTtu9pPPev/b22e64dc307372246bd1bb469dc86c15/mobile1.webp',
        'UiYw4zq8F8m1Pdi1aQR8D/ebb2aa5943afd9fc544c7edfe86811f0/mobile2.webp',
        '7sXjNFohzJQy0k5RmzID9a/af1f465f0510d297efdbf8c7bb0319ba/mobile3.webp',
        '1LPVLEQTvPQZ36aPy4gsgR/a680029e412437c9b458b67e53555385/mobile4.webp',
        '26nOHFXgBi4osjSe8WMIxD/3e49f587fa5c28b617733ccc404ac22e/mobile5.webp',
        '29MOqLCEGwOfLb5VFG1kuP/89ae533aba3a2330b46a0bf3725e2b50/mobile6.webp',
        '7H3mFMSDHiFnOJxM3oa60J/51ab372b07f6ba32dde824a9b55b4fb1/mobile7.webp',
        'grmWgXPW6RBOtJYflUL9a/bbfa873959c52eee5d0661d83c9eaf3a/mobile8.webp',
        '5rwPvFTZU2aFIP2nXNsDtu/c161959b734b5dd3f65af545d58b1216/mobile9.webp',
        '1ndw8wrqBsg70xLBxcvdYo/a72c5220e24777125a59cfa69754d136/mobile10.webp',
        '5llLmTE9S9xDzjt8Gto9el/12f4087703555b17f0393ce28b5db721/mobile11.webp',
        '2AYnSiTzcoxDfyMMgSCWRJ/aaa1f27e5128173e877b303a07f39208/mobile12.webp',
        'AVCzMoq7YPpjpb3ZvmjBo/75febae8d46172f519f0bf81dd1d918c/mobile13.webp',
        '7oH7SasMGJUsQ3o7OwyLa3/3f66fa5d56519387b39a9cfd05c231b0/mobile14.webp',
        '1WhJWCXWJPkvkEqBWJ9TsE/8eef598b74cd012a65803ac26d3c2488/mobile15.webp',
        '12XSKpq47vXxX4jcPO0ks2/ab05eac0250c75e3849c19501ae9de91/mobile16.webp'
    ]
} as const;
