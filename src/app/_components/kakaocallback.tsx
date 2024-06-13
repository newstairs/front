'use client';
import React ,{ useEffect } from 'react';
;import { useSearchParams,useRouter } from 'next/navigation'

const KakaoCallback: React.FC = () => {
  const code = useSearchParams();
  const BACKEND_URL = 'http://localhost:3000/reqlogin';
  const router = useRouter();
  function changeUrlToDummy() {
    const dummyUrl = "/dummy-url";
    history.replaceState(null, '', dummyUrl);
}
  useEffect(() => {
    
    console.log("code:",code.get("code").substring(1))
    window.onload = changeUrlToDummy;
   
    const kakaoLogin = async () => {

        const response = await fetch(`http://localhost:3000/reqlogin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ access_code: code.get("code") })
        })
        .then((res)=>{return res.json();})
        
        localStorage.setItem('access_token',response.data);
        console.log("성공:",response);
        
        // 로그인 성공 시 리디렉션
        setTimeout(() => {
          router.push('/main');
        }, 100);
      
    };

    if (code && BACKEND_URL) {
      kakaoLogin();
    }
  } ,[code, BACKEND_URL,router]);

  return (
    <div className="bg-white w-full h-full">

       <button className="absolute bg-slate-500 w-[200px] h-[200px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 "   >
        <div className="flex items-center">
        <svg className="animate-spin h-[70px] w-[70px] rounded-full white"viewBox='0 0 70 70'>
          <circle cx="10" cy="10" r="40" fill="gray"/>
        
          <circle cx="35" cy="35" r="30" fill="#800080"/>
          
        </svg>
          <div>로그인중....</div>
        </div>
      </button> 
    </div>
  );
};



export default KakaoCallback;