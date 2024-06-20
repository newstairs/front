'use client';
import React, { useState } from "react";
import '../../../styles/overlayContainer.css';

interface selectItem {
  id: number;
  image: string;
  name: string;
}

const CheckList: React.FC = () => {
  const [isListOpen, setIsListOpen] = useState(true); // 리스트 열림/닫힘 상태 관리
  const [selectItems, setSelectItems] = useState<selectItem[]>([
    { id: 2, image: '/path/to/image.jpg', name: '오렌지 주스'},
    { id: 5, image: '/path/to/image.jpg', name: '포도 주스'},
    { id: 6, image: '/path/to/image.jpg', name: '우유' }
  ])
  

  return (
    <div className="list-container bg-transparent">
      <div>
      <button type="button" className="toggle-button" onClick={()=>setIsListOpen(!isListOpen)}>
        {isListOpen ?(
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-6 h-6"><path d="M470.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 256 265.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160zm-352 160l160-160c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L210.7 256 73.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z"/></svg>
        ):(
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-6 h-6"><path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160zm352-160l-160 160c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L301.3 256 438.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0z"/></svg>
        )}
    </button>
      </div>
      <div className={`overlay-container ${isListOpen ? 'overlay-container' : 'Close'}`}>
      {/* <form className="mx-auto mb-5">
        <div className="relative rounded-lg shadow-sm">
          <div className="absolute inset-y-0 start-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input type="search" id="default-search" className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="상품 검색" required />
          <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">검색</button>
        </div>
      </form> */}
        <ul className="flex flex-col items-center divide-y divide-gray-200">
          {selectItems.map(item => (
            <li key={item.id} className="w-full flex items-center p-2">
              <div className="flex flex-row items-center justify-between w-full">
                <img src={item.image} alt={item.name} className="h-10 w-10 object-cover" />
                <div className="text-center text-black mb-2 mx-4">{item.name}</div>
              </div>
            </li>
          ))}
        </ul>
    </div>
  </div>
);
}


export default CheckList;
