'use client';
import React from 'react';
import Image from 'next/image';

const KakaoLogin: React.FC = () => {

  const REST_API_KEY = process.env.NEXT_PUBLIC_REST_API_KEY;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI;
  const Link =`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;

  const handleLogin = () => {
    console.log(REST_API_KEY);
    console.log(REDIRECT_URI);
    window.location.href = Link;
  };

  return (
      <div className="h-screen flex bg-sky-200 justify-center items-center">
        <div className='flex-col mb-10 ml-5 mr-20 justify-center items-center'>
          <div className='mt-5 mb-20 p-5'>
            <p className='mb-2 font-bold text-4xl'>싸게 사서</p>
            <p className='mb-2 font-bold text-4xl'>맛있게 먹자</p>
            <p className='mt-3 text-lg text-stone-600'>현명한 장보기를 위한 당신의 도우미</p>
          </div>
          <div className='flex justify-center items-center'>
            <button onClick={handleLogin} className="flex justify-center items-center">
              <Image src="/utils/kakao_login.png" alt="카카오 로그인" width={300} height={50} priority />
            </button>
          </div>
        </div>
        <img src='./utils/homeimg.png' />
      </div>
  );
};

export default KakaoLogin;
