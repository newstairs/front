<<<<<<< Updated upstream
import LoginHandler from '../../../../components/Login/KakaoLoginHandler'
=======
import LoginHandler from '../../../_components/Login/loginHandler'
>>>>>>> Stashed changes
import React from 'react'

const Page: React.FC = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <LoginHandler />
    </div>
  )
}

export default Page;