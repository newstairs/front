
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
  env: {
    NEXT_PUBLIC_REST_API_KEY: process.env.NEXT_PUBLIC_REST_API_KEY,
    NEXT_PUBLIC_JAVASCRIPT_API_KEY: process.env.NEXT_PUBLIC_JAVASCRIPT_API_KEY,
    NEXT_PUBLIC_FRONT_REDIRECT_URL: process.env.NEXT_PUBLIC_FRONT_REDIRECT_URL,
  },
};
// 디버깅: 로드된 환경 변수를 출력합니다
console.log('Loaded ENV:', process.env.NEXT_PUBLIC_REST_API_KEY);
console.log('Loaded ENV:', process.env.NEXT_PUBLIC_JAVASCRIPT_API_KEY);
console.log('Loaded ENV:', process.env.NEXT_PUBLIC_FRONT_REDIRECT_URL);

export default nextConfig;