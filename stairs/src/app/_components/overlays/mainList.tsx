// 'use client';
// import React, { useState } from "react";
// import '../../styles/overlayContainer.css';

// interface allItem {
//   id: number;
//   image: string;
//   name: string;
// }

// const MainList: React.FC = () => {

//   const [allItems, setAllItems] = useState<allItem[]>([
//     { id: 1, image: '/path/to/image.jpg', name: '사과' },
//     { id: 2, image: '/path/to/image.jpg', name: '오렌지 주스'},
//     { id: 3, image: '/path/to/image.jpg', name: '통밀 빵' },
//     { id: 4, image: '/path/to/image.jpg', name: '당근' },
//     { id: 5, image: '/path/to/image.jpg', name: '포도 주스'},
//     { id: 6, image: '/path/to/image.jpg', name: '우유' }
//   ])

//   return (
//     <div className="overlay-container">
//       <div className="searchBar-container flex">
//         <input type="text" className="searchBar" placeholder="품목을 검색해주세요." />
//         <button className="searchBtn">검색</button>
//       </div>
//         <ul className="divide-y divide-gray-200">
//           {allItems.map(item => (
//             <li key={item.id} className="flex items-center justify-between p-2">
//               <input type="checkbox"></input>
//               <img src={item.image} alt={item.name} className="h-10 w-10 object-cover" />
//               <span>{item.name}</span>
//             </li>
//           ))}
//         </ul>
//     </div>
// );
// }

// export default MainList;
import React, { useState } from "react";
import '../../styles/overlayContainer.css';

interface allItem {
  id: number;
  image: string;
  name: string;
  quantity: number;  // 각 아이템의 수량을 추가
}

const MainList: React.FC = () => {
  const [allItems, setAllItems] = useState<allItem[]>([
    { id: 1, image: '/path/to/image.jpg', name: '사과', quantity: 1 },
    { id: 2, image: '/path/to/image.jpg', name: '오렌지 주스', quantity: 1 },
    { id: 3, image: '/path/to/image.jpg', name: '통밀 빵', quantity: 1 },
    { id: 4, image: '/path/to/image.jpg', name: '당근', quantity: 1 },
    { id: 5, image: '/path/to/image.jpg', name: '포도 주스', quantity: 1 },
    { id: 6, image: '/path/to/image.jpg', name: '우유', quantity: 1 }
  ]);

  const increment = (id: number) => {
    setAllItems(allItems.map(item => item.id === id ? {...item, quantity: item.quantity + 1} : item));
  };

  const decrement = (id: number) => {
    setAllItems(allItems.map(item => 
      item.id === id && item.quantity > 1 ? {...item, quantity: item.quantity - 1} : item));
  };

  return (
    <div className="overlay-container">
      <form className="mx-auto mb-5">
        <div className="relative rounded-lg shadow-sm">
          <div className="absolute inset-y-0 start-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input type="search" id="default-search" className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="상품 검색" required />
          <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">검색</button>
        </div>
      </form>
      <ul className="divide-y divide-gray-200">
        {allItems.map(item => (
          <li key={item.id} className="flex items-center justify-between p-2">
            <img src={item.image} alt={item.name} className="h-10 w-10 object-cover mr-2" />
            <div className="flex-1 text-center text-black">{item.name}</div>
            <div className="flex items-center">
              <button onClick={() => decrement(item.id)} className="px-3 py-1 bg-red-300 rounded hover:bg-red-400">-</button>
              <span className="mx-2 text-black">{item.quantity}</span>
              <button onClick={() => increment(item.id)} className="px-3 py-1 bg-green-300 rounded hover:bg-green-400">+</button>
            </div>
          </li>
        ))}
      </ul>
    </div>

  );
}

export default MainList;

