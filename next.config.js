/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            's3-alpha-sig.figma.com',
            'google.com',
            'www.wallpaperflare.com',
            '*',
        ],
    },
};

module.exports = nextConfig;
