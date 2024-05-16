'use client';
import React from "react";

const Header: React.FC = () => {
  
  const items: string[] = [ "메인 품목 리스트", "마트 별 선택 항목", "장바구니" ];

  const handleClick = (index: number, item: string): void => {
    console.log(`Clicked item: ${item}, Index: ${index}`);
  }

  return (
    <header className="fixed top-0 w-full shadow-md">
      <div className="flex justify-between">
        <div className="flex items-center pl-6">
          <button className=""> 로그아웃 </button>
        </div>
        <div>
          <ul className="flex space-x-4 p-4">
            {items.map((item, index) => (
              <li key={index} onClick={() => handleClick(index, item)}>
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
