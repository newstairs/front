'use client';
import React from "react";

const Header: React.FC = () => {
  
  const items: string[] = ["장바구니", "메인 품목 리스트", "마트 별 선택 항목"];

  const handleClick = (index: number, item: string): void => {
    console.log(`Clicked item: ${item}, Index: ${index}`);
  }

  return (
    <header className="fixed top-0 w-full bg-black shadow-md">
      <ul className="flex justify-end space-x-4 p-4">
        {items.map((item, index) => (
          <li key={index} onClick={() => handleClick(index, item)}>
            {item}
          </li>
        ))}
      </ul>
    </header>
  );
}

export default Header;
