/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: { domains: ['s2.coinmarketcap.com', 'cdn.snapi.dev'] },
  async headers() {
    return [
      {
        source: '/fonts',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=31536000',
          },
        ],
      },
    ];
  },
};
