'use client';
import React ,{ useEffect } from 'react';
import { useSearchParams,useRouter } from 'next/navigation'
import ReviewDetail from "../../../../_components/review/ReviewDetail"

const Review: React.FC = () => {

  const search=useSearchParams();

  const url=window.location.href;
  const id=url.substring(37, url.length);
  
  console.log(id);

  return (
    <div className="h-screen flex justify-center items-center w-full bg-slate-500">
      <ReviewDetail id={Number(id)}/>
    </div>
  )
}

export default Review;


