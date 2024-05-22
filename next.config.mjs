const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

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
};

const decodeBase64 = (encoded) => {
  return Buffer.from(encoded, 'base64').toString('utf8');
};

// YAML 파일에서 환경 변수를 로드
const loadEnvFromYaml = () => {
  try {
    const envPath = path.resolve(__dirname, 'secrets.yaml');
    const fileContents = fs.readFileSync(envPath, 'utf8');
    const data = yaml.load(fileContents);

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        process.env[key] = decodeBase64(data[key]);
      }
    }
  } catch (e) {
    console.error('Error loading environment variables from YAML:', e);
  }
};

// 환경 변수를 로드합니다
loadEnvFromYaml();

// Next.js 환경 변수 설정
nextConfig.env = {
  NEXT_PUBLIC_REST_API_KEY: process.env.NEXT_PUBLIC_REST_API_KEY,
  NEXT_PUBLIC_JAVASCRIPT_API_KEY: process.env.NEXT_PUBLIC_JAVASCRIPT_API_KEY,
  NEXT_PUBLIC_FRONT_REDIRECT_URL: process.env.NEXT_PUBLIC_FRONT_REDIRECT
};

module.exports = nextConfig;