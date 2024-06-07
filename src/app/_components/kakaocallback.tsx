'use client';
import React ,{ useEffect } from 'react';
;import { useSearchParams,useRouter } from 'next/navigation'

const KakaoCallback: React.FC = () => {
  const code = useSearchParams();
  const BACKEND_URL = 'http://localhost:3000/reqlogin';
  const router = useRouter();

  useEffect(() => {
    console.log("code:",code.get("code").substring(1))
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
        console.log("성공:",typeof(response.data));
        
        // 로그인 성공 시 리디렉션
        setTimeout(() => {
          router.push('/main');
        }, 100);
      
    };

    if (code && BACKEND_URL) {
      kakaoLogin();
    }
  }, [code, BACKEND_URL, router]);

  return (
    <div>
      <h1>Kakao OAuth Callback</h1>
      <p>Processing your authentication...</p>
    </div>
  );
};

export default KakaoCallback;