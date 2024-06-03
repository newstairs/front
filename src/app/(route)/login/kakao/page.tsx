import LoginHandler from '../../../../components/Login/KakaoLoginHandler'
import React from 'react'

const Page: React.FC = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <LoginHandler />
    </div>
  )
}

export default Page;