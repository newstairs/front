'use client';
import React from 'react';
import Image from 'next/image';

const KakaoLogin: React.FC = () => {

  const REST_API_KEY = process.env.NEXT_PUBLIC_REST_API_KEY;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI;
  const Link =`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;

  if (!REST_API_KEY || !REDIRECT_URI) {
    return null; // 환경 변수가 없으면 아무것도 렌더링하지 않음
  }

    const handleLogin = () => {
      console.log(REST_API_KEY);
      console.log(REDIRECT_URI);
      window.location.href = Link;
    };

    return (
        <div className="h-screen flex justify-center items-center">
          <button onClick={handleLogin} className="flex justify-center items-center">
            <Image src="/utils/kakao_login.png" alt="카카오 로그인" width={300} height={50} priority />
          </button>
        </div>
    );
};

export default KakaoLogin;
