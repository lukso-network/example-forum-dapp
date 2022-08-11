/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  basePath: '/forum-dapp',
  images: {
    loader: 'akamai',
    path: '',
  },
};

module.exports = nextConfig;
