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
  // async rewrites() {
  //   return [
  //     {
  //       source: "/reviews/detail/:id",
  //       destination: "/reviews/detail/:id",
  //     },
  //     {
  //       source:"/friend/:name/:id/:martname",
  //       destination:"/friend/:name/:id/:martname"
  //     },
  //     {
  //       source: "/:path*",
  //       destination: "http://ec2-15-164-104-176.ap-northeast-2.compute.amazonaws.com:8080/:path*",
  //     }
  //   ];
  // },
  reactStrictMode:false
};

export default nextConfig;
