'use client';
import React, { useState } from "react";

interface HeaderProps {
  onItemSelected: (index: number) => void;  // 콜백 함수 타입 정의
}

const Header: React.FC<HeaderProps> = ({ onItemSelected }) => {
  const items: string[] = [ "메인 품목 리스트", "마트 별 선택 항목", "장바구니" ];
  const [activeIndex, setActiveIndex] = useState<number>(0); 

  const handleClick = (index: number, item: string): void => {
    console.log(`Clicked item: ${items[index]}, Index: ${index}`);
    onItemSelected(index);  
    setActiveIndex(index);  
  }

  return (
    <header className="fixed top-0 w-full shadow-md">
      <div className="flex justify-between">
        <div className="flex items-center pl-6">
          <button className="">로그아웃</button>
        </div>
        <div>
          <ul className="flex space-x-4 p-4">
            {items.map((item, index) => (
              <li key={index} onClick={() => handleClick(index, item)}
                  className={`cursor-pointer ${index === activeIndex ? 'text-blue-500' : 'text-white-700'}`}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;

