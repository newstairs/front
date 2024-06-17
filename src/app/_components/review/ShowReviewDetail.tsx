'use client'
import React ,{ useEffect,useState } from 'react';




interface Detail{
    content:string,
    setting_show:(x:boolean)=>void
}
const ReviewDetails: React.FC<Detail> = ({content,setting_show})=>{
    const close=()=>{
        setting_show(false);
        console.log("close");
        }

    return (
        /*
        리뷰 상세내용을 보여주는 모달창 컴포넌트.

        버튼 태그는 모달창을 닫는 태그이다.
        */ 
        <div className="absolute w-[200px] h-[200px] bg-red-500 top-1/2 left-1/2 -trasform translate-x-1/2 -translate-y-1/2">
        
        {content}
        
        <button className="bg-white w-[200px]"onClick={()=>{close()}}>x</button>
        </div>
    )
}


export default ReviewDetails;