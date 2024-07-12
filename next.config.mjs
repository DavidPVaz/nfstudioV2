/** @type {import('next').NextConfig} */
export default {
    images: {
        loader: 'custom',
        loaderFile: './src/components/atoms/image/loader.ts'
    },
    webpack: config => {
        config.module.rules.push({
            test: /\.svg$/,
            use: [{ loader: '@svgr/webpack' }]
        });

        return config;
    }
};
