/** @type {import('next').NextConfig} */
export default {
    images: {
        loader: 'custom',
        loaderFile: './src/components/atoms/image/loader.ts'
    },
    webpack: config => {
        config.module.rules.push(
            {
                test: /\.svg$/,
                use: [{ loader: '@svgr/webpack' }]
            },
            {
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
