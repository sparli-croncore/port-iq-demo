/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/port_iq/api/:path*',
        destination: 'https://portiq.croncore.com/api/chat/:path*', // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
