/** @type {import('next').NextConfig} */
import Analyzer from '@next/bundle-analyzer';
const withBundleAnalyzer = Analyzer({ enabled: process.env.ANALYZE === 'true' });

const config = {
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

export default withBundleAnalyzer(config);
