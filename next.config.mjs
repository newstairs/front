/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true,
      },
    ];
  },  
  async rewrites() {
    return [
      {
        source: "/reviews/:id",
        destination: "/reviews/:id",
      },
      {
        source: "/:path*",
        destination: "http://ec2-15-164-104-176.ap-northeast-2.compute.amazonaws.com:8080/:path*",
      }
    ];
  },
};

export default nextConfig;
