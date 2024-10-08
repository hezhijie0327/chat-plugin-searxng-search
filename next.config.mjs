/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // matching all API routes
        source: '/:path*',
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
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/searxng/gateway',
        destination: '/api/gateway'
      },
      {
        source: '/searxng/search',
        destination: '/api/search'
      },
      {
        source: '/searxng/manifest.json',
        destination: '/manifest.json'
      },
      {
        source: '/searxng/manifest-dev.json',
        destination: '/manifest-dev.json'
      },
    ]
  },
};

export default nextConfig;
