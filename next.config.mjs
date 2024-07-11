/** @type {import('next').NextConfig} */
export default {
    webpack: config => {
        config.module.rules.push({
            test: /\.svg$/,
            use: [{ loader: '@svgr/webpack' }]
        });

        return config;
    }
};
