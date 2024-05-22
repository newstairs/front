// 'use client';
// import React, { useState, useEffect } from 'react';

// interface CartItem {
//   id: number;
//   image: string; // 이미지 URL
//   name: string; // 상품명
//   mart: string; // 마트 이름
//   price: number; // 가격
//   quantity: number; // 초기 수량
// }

// const CartList: React.FC = () => {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);

//   // 백엔드에서 데이터를 불러오는 함수
//   // const fetchCartItems = async () => {
//   //   try {
//   //     const response = await fetch('YOUR_API_ENDPOINT/cart_items');
//   //     const data = await response.json();
//   //     setCartItems(data.map((item: CartItem) => ({
//   //       ...item,
//   //       quantity: 1 // 초기 수량을 1로 설정
//   //     })));
//   //   } catch (error) {
//   //     console.error('Failed to fetch items', error);
//   //   }
//   // };
//   const fetchCartItems =() =>{ 

//   }

//   // 컴포넌트 마운트 시 데이터 불러오기
//   useEffect(() => {
//     fetchCartItems();
//   }, []);

//   // 수량 조정 함수
//   const handleQuantityChange = (id: number, delta: number) => {
//     setCartItems(prevItems =>
//       prevItems.map(item =>
//         item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
//       )
//     );
//   };

//   return (
//     <div className="p-4">
//       <ul className="divide-y divide-gray-200">
//         {cartItems.map(item => (
//           <li key={item.id} className="flex justify-between items-center py-3">
//             <img src={item.image} alt={item.name} className="h-10 w-10 object-cover" />
//             <span>{item.name}</span>
//             <span>{item.mart}</span>
//             <span>{item.price.toLocaleString()}원</span>
//             <div className="flex items-center">
//               <button className="px-2 py-1 text-sm border border-gray-300"
//                 onClick={() => handleQuantityChange(item.id, -1)}>-</button>
//               <span className="px-4">{item.quantity}</span>
//               <button className="px-2 py-1 text-sm border border-gray-300"
//                 onClick={() => handleQuantityChange(item.id, 1)}>+</button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default CartList;

import React, { useState } from 'react';
import '../../styles/overlayContainer.css';

interface CartItem {
  id: number;
  image: string; // 이미지 URL
  name: string; // 상품명
  mart: string; // 마트 이름
  price: number; // 가격
  quantity: number; // 초기 수량
}

const CartList: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, image: '/path/to/image.jpg', name: '사과', mart: 'A마트', price: 4500, quantity: 1 },
    { id: 2, image: '/path/to/image.jpg', name: '오렌지 주스', mart: 'B마트', price: 3500, quantity: 2 },
    { id: 3, image: '/path/to/image.jpg', name: '통밀 빵', mart: 'C마트', price: 2500, quantity: 3 }
  ]);

  // 수량 조정 함수
  const handleQuantityChange = (id: number, delta: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
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
          {cartItems.map(item => (
            <li key={item.id} className="flex items-center justify-between p-2">
              <input type="checkbox"></input>
              <img src={item.image} alt={item.name} className="h-10 w-10 object-cover" />
              <span className="text-black">{item.name}</span>
              <span className="text-black">{item.mart}</span>
              <span className="text-black">{item.price.toLocaleString()}원</span>
              <div className="flex items-center">
                <button className="px-3 py-1 bg-red-300 rounded hover:bg-red-400"
                  onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                <span className="mx-2 text-black">{item.quantity}</span>
                <button className="px-3 py-1 bg-green-300 rounded hover:bg-green-400"
                  onClick={() => handleQuantityChange(item.id, 1)}>+</button>
              </div>
            </li>
          ))}
        </ul>
    </div>
//     <div className="overlay-container">
//   <ul className="divide-y divide-gray-200">
//     {cartItems.map(item => (
//       <li key={item.id} className="grid grid-cols-6 items-center p-2">
//         <input type="checkbox" />
//         <img src={item.image} alt={item.name} className="object-cover" />
//         <span className="text-black">{item.name}</span>
//         <span className="text-black">{item.mart}</span>
//         <span className="text-black">{item.price.toLocaleString()}원</span>
//         <div className="flex items-center">
//           <button className="px-3 py-1 bg-red-300 rounded hover:bg-red-400"
//             onClick={() => handleQuantityChange(item.id, -1)}>-</button>
//           <span className="mx-2 text-black">{item.quantity}</span>
//           <button className="px-3 py-1 bg-green-300 rounded hover:bg-green-400"
//             onClick={() => handleQuantityChange(item.id, 1)}>+</button>
//         </div>
//       </li>
//     ))}
//   </ul>
// </div>
  );
};

export default CartList;
