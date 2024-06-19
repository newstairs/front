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
        <button type="button" className='toggle-button' onClick={() => setIsListOpen(!isListOpen)}>
          <svg className="h-8 w-8 text-slate-500 toggle-icon"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <polyline points="7 7 12 12 7 17" />  <polyline points="13 7 18 12 13 17" /></svg>
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
