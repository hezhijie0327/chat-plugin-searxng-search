/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async headers() {
    return [
      {
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
        source: '/:path*',
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/searxng-search/api/gateway',
        destination: '/api/gateway'
      },
      {
        source: '/searxng-search/api/search',
        destination: '/api/search'
      },
      {
        source: '/searxng-search/manifest.json',
        destination: '/manifest.json'
      },
      {
        source: '/searxng-search/manifest-dev.json',
        destination: '/manifest-dev.json'
      },
      {
        source: '/searxng-search/searxng.svg',
        destination: '/searxng.svg'
      },
    ]
  },
};

export default nextConfig;
