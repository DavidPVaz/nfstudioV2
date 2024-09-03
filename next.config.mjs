/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/** @type {import('next').NextConfig} */
import { withSentryConfig } from '@sentry/nextjs';
import Analyzer from '@next/bundle-analyzer';
const withBundleAnalyzer = Analyzer({ enabled: process.env.ANALYZE === 'true' });

const config = {
    experimental: {
        instrumentationHook: true
    },
    webpack: config => {
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
