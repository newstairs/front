// 'use client'
// import React ,{ useEffect,useState } from 'react';

// interface Detail{
//   content:string,
//   setting_show:(x:boolean)=>void
// }
// const ReviewDetails: React.FC<Detail> = ({ content, setting_show }) => {
// 	const close = () => {
// 		setting_show(false);
// 		console.log("close");
// 	}

// 	return (
// 		<div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4">
// 				<div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
// 						<div className="p-5">
// 								<div className="text-gray-800 text-sm">
// 										{content}
// 								</div>
// 						</div>
// 						<button onClick={close} 
// 										className="absolute top-0 right-0 p-2 text-gray-600 hover:text-gray-800">
// 								<span className="text-2xl">&times;</span>
// 						</button>
// 				</div>
// 		</div>
// 	)
// }

// export default ReviewDetails;
'use client'
import React, { useEffect, useState } from 'react';

interface Detail {
  title: string;
  content: string;
  setting_show: (x: boolean) => void;
}

const ReviewDetails: React.FC<Detail> = ({ content, setting_show }) => {
  const close = () => {
    setting_show(false);
    console.log("close");
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex-col p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-2">상세 내용</h2>
          <div className="text-gray-800 text-sm">
            {content}
          </div>
          <button className="bg-transparent hover:bg-sky-200 font-semibold hover:text-white py-2 px-4 border border-bg-sky-300 hover:border-transparent rounded">수정</button>
          <button className="bg-transparent hover:bg-sky-200 font-semibold hover:text-white py-2 px-4 border border-bg-sky-300 hover:border-transparent rounded">삭제</button>
        </div>
        <button onClick={close} 
                className="absolute top-0 right-0 p-2 text-gray-600 hover:text-gray-800">
          <span className="text-2xl">&times;</span>
        </button>
      </div>
    </div>
  )
}

export default ReviewDetails;
