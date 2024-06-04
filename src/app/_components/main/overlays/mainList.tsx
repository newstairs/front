import React, { useState, useEffect } from "react";
import '../../../styles/overlayContainer.css';

interface allItem {
  productId: number;
  productImgUrl: string;
  productName: string;
}

const MainList: React.FC = () => {
  const [allItems, setAllItems] = useState<allItem[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://ec2-15-164-104-176.ap-northeast-2.compute.amazonaws.com:8080/products',{
          headers: {
            'Content-Type': 'application/json'
          }
        });  // 백엔드 URL
        const data = await response.json();
        console.log(data);
        setAllItems(data.data);  
      } catch (error) {
        console.error('Fetching data failed', error);
      }
    };

    fetchData();  // fetchData 함수 실행
  }, []);

return (
  <div className="list-container bg-transparent">
    <div>
       <button type="button" className="toggle-button">
      <svg className="h-8 w-8 text-slate-500 toggle-icon"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <polyline points="7 7 12 12 7 17" />  <polyline points="13 7 18 12 13 17" /></svg>
    </button>
    </div>
   
    <div className="overlay-container">
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
        {allItems.map(item => (
          <li key={item.productId} className="w-full flex items-center p-2 ">
            <div className="flex flex-row items-center justify-between w-full">
              <img src={item.productImgUrl} alt={item.productName} className="h-10 w-10 object-cover mb-2" />
              <div className="text-center text-white mb-2 mx-4">{item.productName}</div>
              <button type="button" className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">
                추가
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
}

export default MainList;
