import React, { useState, useEffect } from "react";
import Pagination from '../../pagination';
import '../../../styles/overlayContainer.css';

interface allItem {
  productId: number;
  productImgUrl: string;
  productName: string;
}


interface allItem2 {
  productId: number;
  productImgUrl: string;
  productName: string;
  quantity:number;
}

//http://ec2-15-164-104-176.ap-northeast-2.compute.amazonaws.com:8080/products?page=${currentPage - 1}&size=11
const MainList: React.FC = () => {
  const [allItems, setAllItems] = useState<allItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // 페이지 번호 상태 추가
  const [totalPages] = useState(9); // 총 페이지 수
  const [isListOpen, setIsListOpen] = useState(true); // 리스트 열림/닫힘 상태 관리

  const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

  //로컬 스토리지에 사용자가 택한 아이템들을 추가하는 과정.
  /*const AddToLocalStorage=(itemid:number,itemimgurl:string,itemname:string)=>{
      if(JSON.parse(localStorage.getItem("Item_Chosen"))===null){
        const product_list:allItem2[]=[{
          productId:itemid,
          productImgUrl:itemimgurl,
          productName:itemname,
          quantity:0
        }]
        localStorage.setItem("Item_Chosen",JSON.stringify(product_list))
      }
      else{

        let product_list:allItem2[]=JSON.parse(localStorage.getItem("Item_Chosen"));
        const data:allItem2={
          productId:itemid,
          productImgUrl:itemimgurl,
          productName:itemname,
          quantity:0
        }
        let data_list=product_list.filter(x=>{
          if(x.productId===itemid){
            return true;
          }
          return false;
        })


        if(data_list.length===0){
          product_list.push(data);
          localStorage.setItem("Item_Chosen",JSON.stringify(product_list));
        }

      }    
  }*/

  //fetch문으로 가져와서 백엔드에다가 데이터를 넣는과정.
  const add_to_cartlist=async(itemid:number,itemimgurl:string,itemname:string)=>{
    try{
      const response=await fetch(`${BACKEND_URI}/cart`,{
        method:"POST",
        headers:{
          Authorization:"Bearer "+localStorage.getItem("access_token"),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId:itemid
        })
      })
      const res = await response.json();

      if(!res.success){
        console.log("error:",res.message);
      }
      else {
        console.log("success add cartlist:", res);
      }
    }
    catch (error) {
      console.error('Error adding to cart:', error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BACKEND_URI}/products?page=${currentPage-1}&size=12`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: "Bearer "+localStorage.getItem("access_token")
          }
        });
        const data = await response.json();
        console.log("cartitem:",data);
        if(data && data.data){
          setAllItems(data.data);  
        }
        else {
          setAllItems([]);
        }
      } catch (error) {
        console.error('Fetching data failed', error);
        setAllItems([]);
      }
    };

    fetchData();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
      setCurrentPage(page);
  };
return (
  <div className="list-container">
    <div>
      <button type="button" className="toggle-button" onClick={()=>setIsListOpen(!isListOpen)}>
        {isListOpen ?(
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-6 h-6"><path d="M470.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 256 265.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160zm-352 160l160-160c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L210.7 256 73.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z"/></svg>
        ):(
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-6 h-6"><path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160zm352-160l-160 160c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L301.3 256 438.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0z"/></svg>
        )}
    </button>
    </div>
    <div className={`${isListOpen ? 'overlay-container' : 'Close'}`}>
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
              <div className="truncate text-center text-black mx-4">{item.productName}</div>
              <button onClick={()=>{add_to_cartlist(item.productId,item.productImgUrl,item.productName)}} type="button" className="text-sky-700 hover:text-white border border-sky-300 hover:bg-sky-400 focus:ring-4 focus:outline-none focus:ring-sky-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-sky-500 dark:text-sky-500 dark:hover:text-white dark:hover:bg-sky-500 dark:focus:ring-sky-800">
                추가
              </button>
            </div>
          </li>
        ))}
      </ul>
        <div className="flex justify-center w-full p-1">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
    </div>
  </div>
);
}

export default MainList;

