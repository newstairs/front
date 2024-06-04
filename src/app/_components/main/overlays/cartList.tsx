import React, { useState } from 'react';
import '../../../styles/overlayContainer.css';
import Map from "../map/Map";


interface CartItem {
  productId: number;
  productImgUrl: string; // 이미지 URL
  productName: string; // 상품명
  quantity: number; // 초기 수량
}

const CartList: React.FC = () => {

  const [isopen,setisopen]= useState(()=>{});

  const [cartItems, setCartItems] = useState<CartItem[]>([
    { productId: 1, productImgUrl: '/path/to/image.jpg', productName: '사과',  quantity: 1 },
    { productId: 2, productImgUrl: '/path/to/image.jpg', productName: '오렌지 주스',  quantity: 2 },
    { productId: 3, productImgUrl: '/path/to/image.jpg', productName: '통밀 빵',  quantity: 3 }
  ]);

  // 수량 조정 함수
  const handleQuantityChange = (id: number, delta: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.productId === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };
  const [location, setLocation] =useState<{ datas:string[] }>(null);
  //useState<{ lat: number; lng: number}> ({lat: 33.450701, lng: 126.570667 });
 
  const clicketst=()=>{
    //setLocation({lat,lng})
    setLocation({datas:["KB국민은행 상계역지점","IBK기업은행365 중계주공3단지아파트"]})
   console.log("click---test")
   
  }
  

  return (
  <div className="list-container bg-transparent">
      <svg className="h-8 w-8 text-slate-500 toggle-icon"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <polyline points="7 7 12 12 7 17" />  <polyline points="13 7 18 12 13 17" /></svg>
    <div className="overlay-container">

        <ul className="flex flex-col items-center divide-y divide-gray-200">

          {cartItems.map(item => (
            <li key={item.productId} className="w-full flex items-center p-2">
              <input type="checkbox"></input>
              <img src={item.productImgUrl} alt={item.productName} className="h-10 w-10 object-cover" />
              <span className="text-white">{item.productName}</span>
              <div className="flex items-center">
                <button className="px-3 py-1 bg-red-300 rounded hover:bg-red-400"
                  onClick={() => handleQuantityChange(item.productId, -1)}>-</button>
                <span className="mx-2 text-white">{item.quantity}</span>
                <button className="px-3 py-1 bg-green-300 rounded hover:bg-green-400"
                  onClick={() => handleQuantityChange(item.productId, 1)}>+</button>
              </div>
            </li>
          ))}
        </ul>
        <button onClick={()=>clicketst()}>hello? {location!==null &&<Map location={location}/>}</button>
    </div>

    

    </div>


  );
};

export default CartList;
