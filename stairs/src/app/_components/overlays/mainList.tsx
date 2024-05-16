'use client';
import React, { useState } from "react";
import '../../styles/overlayContainer.css';

interface allItem {
  id: number;
  image: string;
  name: string;
}

const MainList: React.FC = () => {

  const [allItems, setAllItems] = useState<allItem[]>([
    { id: 1, image: '/path/to/image.jpg', name: '사과' },
    { id: 2, image: '/path/to/image.jpg', name: '오렌지 주스'},
    { id: 3, image: '/path/to/image.jpg', name: '통밀 빵' },
    { id: 4, image: '/path/to/image.jpg', name: '당근' },
    { id: 5, image: '/path/to/image.jpg', name: '포도 주스'},
    { id: 6, image: '/path/to/image.jpg', name: '우유' }
  ])

  return (
    <div className="overlay-container">
      <div className="searchBar-container flex">
        <input type="text" className="searchBar" placeholder="품목을 검색해주세요." />
        <button className="searchBtn">검색</button>
      </div>
        <ul className="divide-y divide-gray-200">
          {allItems.map(item => (
            <li key={item.id} className="flex items-center justify-between p-2">
              <input type="checkbox"></input>
              <img src={item.image} alt={item.name} className="h-10 w-10 object-cover" />
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
    </div>
);
}

export default MainList;
