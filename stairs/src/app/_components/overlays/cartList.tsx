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
        <ul className="divide-y divide-gray-200">
          {cartItems.map(item => (
            <li key={item.id} className="flex items-center justify-between p-2">
              <input type="checkbox"></input>
              <img src={item.image} alt={item.name} className="h-10 w-10 object-cover" />
              <span>{item.name}</span>
              <span>{item.mart}</span>
              <span>{item.price.toLocaleString()}원</span>
              <div className="flex items-center">
                <button className="px-2 py-1 text-sm border border-gray-300"
                  onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                <span className="px-4">{item.quantity}</span>
                <button className="px-2 py-1 text-sm border border-gray-300"
                  onClick={() => handleQuantityChange(item.id, 1)}>+</button>
              </div>
            </li>
          ))}
        </ul>
    </div>
  );
};

export default CartList;
