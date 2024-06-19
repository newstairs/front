import KakaoCallback from '@/app/_components/kakaocallback';
import React, { Suspense } from 'react'

const Page: React.FC = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <Suspense>
        <KakaoCallback/>
      </Suspense>
    </div>
  )
}

export default Page;