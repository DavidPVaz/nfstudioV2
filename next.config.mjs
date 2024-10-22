/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/** @type {import('next').NextConfig} */
import { withSentryConfig } from '@sentry/nextjs';
import Analyzer from '@next/bundle-analyzer';
const withBundleAnalyzer = Analyzer({ enabled: process.env.ANALYZE === 'true' });

let ContentSecurityPolicy = `
    navigate-to 'self';
    style-src 'self' 'unsafe-inline' https://embed.hel.io/assets/index-v1.css;
    img-src 'self' blob: data: https:;
    worker-src 'self';
    connect-src 'self' wss://relay.walletconnect.com wss://www.walletlink.org/rpc https:;
    font-src 'self' https://helio-assets.s3.eu-west-1.amazonaws.com/fonts/inter-var-latin.woff2 https://helio-assets.s3.eu-west-1.amazonaws.com/fonts/Poppins-Bold.woff2 https://helio-assets.s3.eu-west-1.amazonaws.com/fonts/Poppins-Regular.woff2;
    object-src 'none';
    media-src 'none';
    frame-src https://verify.walletconnect.com/ https://verify.walletconnect.org/;
    manifest-src 'self';
    base-uri 'none';
    form-action 'none';`;

// adds extra conditions both in production and preview(staging) environments
if (process.env.VERCEL_ENV !== 'development') {
    // TODO: https://github.com/vercel/next.js/discussions/54907 -> 'unsafe-inline' WARNING -> Next.js needs to add hash support to static rendering
    ContentSecurityPolicy = ContentSecurityPolicy.concat(
        ` script-src https://embed.hel.io/assets/ 'self' 'unsafe-inline'; default-src 'none';`
    );
}

const headers = [
    {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload'
    },
    {
        key: 'X-XSS-Protection',
        value: '1; mode=block'
    },
    {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
    },
    {
        key: 'X-Frame-Options',
        value: 'DENY'
    },
    {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin'
    },
    {
        key: 'Content-Security-Policy',
        value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
    }
];

const robotTagHeader = {
    key: 'X-Robots-Tag',
    value: 'noindex'
};

const sources = ['/api/:path*', '/_next/data/:path*', '/_next/image/:path*'];

// adds header both in development and preview(staging) environments
if (process.env.VERCEL_ENV !== 'production') {
    headers.push(robotTagHeader);
}

const config = {
    reactStrictMode: false,
    productionBrowserSourceMaps: false,
    experimental: {
        instrumentationHook: true
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers
            },
            // no matter the environment, all these sources will have X-Robot-Tag = noindex
            ...sources.map(source => ({ source, headers: [robotTagHeader] })),
            {
                // matching all API routes
                source: '/api/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Credentials', value: 'true' },
                    { key: 'Access-Control-Allow-Origin', value: process.env.ORIGIN },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET,OPTIONS,POST'
                    }
                ]
            }
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**'
            }
        ]
    },
    webpack: (config, { webpack }) => {
        config.module.rules.push(
            {
                test: /\.svg$/,
                use: [{ loader: '@svgr/webpack' }]
            },
            {
                // https://github.com/vercel/next.js/issues/12557
                // https://stackoverflow.com/questions/74442696/webpack-doesnt-split-a-huge-vendor-bundle-when-using-barrel-files
                test: [
                    /src\/components\/atoms\/index.ts/i,
                    /src\/components\/molecules\/index.ts/i,
                    /src\/components\/organisms\/index.ts/i,
                    /src\/hooks\/index.ts/i
                ],
                sideEffects: false
            }
        );

        //https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/tree-shaking/
        config.plugins.push(
            new webpack.DefinePlugin({
                __SENTRY_DEBUG__: false,
                __SENTRY_TRACING__: false
            })
        );

        return config;
    }
};

export default withBundleAnalyzer(
    withSentryConfig(config, {
        // For all available options, see:
        // https://github.com/getsentry/sentry-webpack-plugin#options

        // Suppresses source map uploading logs during build
        silent: true,
        org: 'david-vaz',
        project: 'nfstudio',

        // Transpiles SDK to be compatible with IE11 (increases bundle size)
        transpileClientSDK: true,

        // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
        tunnelRoute: '/monitoring',

        // Hides source maps from generated client bundles
        hideSourceMaps: true,

        // Automatically tree-shake Sentry logger statements to reduce bundle size
        disableLogger: true
    })
);
