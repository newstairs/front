'use client';
import React, { useEffect } from 'react';
import axios from 'axios';

const LoginHandler: React.FC =() => {
  const code = new URL(window.location.href).searchParams.get("code");
  const back ='back_redirect_uri';

  useEffect(() => {
    const kakaoLogin = async () => {
		try {
			const res = await axios.post(`${back}`, {
				access_code: code
			});
			localStorage.setItem("access_token", res.data.access_token);
			console.log(res);
			console.log("성공" + code);
			
			// setTimeout(() => {
			// 	window.location.href = '/main';
			// }, 100);
		} catch (error){
			console.error("Error occured", error);
			console.log(code);
			// window.location.href = "/login";
			} 
	}; if(code) {
		kakaoLogin();
		}
	}, [code]);

  return(
    <div>
      
    </div>
  );
  
};

export default LoginHandler;
