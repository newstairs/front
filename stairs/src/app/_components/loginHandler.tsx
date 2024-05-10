'use client';
import React from 'react';




const LoginHandler: React.FC =() => {

  const Code = new URL(window.location.href).searchParams.get("code");

 /* code 백엔드로 쏘기 
  const response = await axios.get(
    `${API 서버 주소/reqlogin}/oauth/token?code=${code}`,
    { withCredentials: true }
  );
  */

  //Code 를 백엔드로 쏘고 - access token 받아와서 - localstorage 저장 하면 끝.

  return(
    <div>

    </div>
  );
  
};

export default LoginHandler;
