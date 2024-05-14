'use client';
import React, { useEffect } from 'react';


const LoginHandler: React.FC =() => {
  const code = new URL(window.location.href).searchParams.get("code");
  const back ='백엔드 주소';

  useEffect(() => {
    const kakaoLogin = async () => {
      if(code){
        try{
          const response = await fetch(`${back}`,{
            method:'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({access_code: code})
          });
          if(!response.ok){
            throw new Error('서버에서 응답을 받지 못했습니다.');
          }

          const data = await response.json();
          localStorage.setItem('access_token',data.access_token);
          console.log("성공",code,data);
          // setTimeout(() => {
          // 	window.location.href = '/main';
          // }, 100);
        }
        catch (error) {
          console.error("Error occurred", error);
          console.log("로그인 실패", code);

          // 선택적: 에러 시 리디렉션
          // window.location.href = "/login";
      }
		} 
	};
  kakaoLogin();
	}, [code]);

  return(
    <div>
       {/* 로그인 처리 중이거나 결과에 따라 표시할 내용 */}
    </div>
  );
  
};

export default LoginHandler;
