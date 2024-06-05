import React, { useEffect, useState } from 'react';
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

 /* const [cartItems, setCartItems] = useState<CartItem[]>([
    { productId: 1, productImgUrl: '/path/to/image.jpg', productName: '사과',  quantity: 1 },
    { productId: 2, productImgUrl: '/path/to/image.jpg', productName: '오렌지 주스',  quantity: 2 },
    { productId: 3, productImgUrl: '/path/to/image.jpg', productName: '통밀 빵',  quantity: 3 }
  ]);*/


  const cart_list=JSON.parse(localStorage.getItem("Item_Chosen")) || [];
  const hasItems=cart_list.length>0;

  // 수량 조정 함수
  
  const handleQuantityChange = (id: number, delta: number) => {
    const cartItems=JSON.parse(localStorage.getItem("Item_Chosen"));
    let update_list=cartItems.map(item=>{
      
      return item.productId === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
    })
    localStorage.setItem("Item_Chosen",JSON.stringify(update_list));
    let spans=document.getElementById(`span_${id}`);
    spans.textContent=(Number(spans.textContent)+delta >=0 ? Number(spans.textContent)+delta:0).toString();
  }; 

  const handleQuantityChange2=async (id:number,delta:number)=>{
    const plus=`http://localhost:3000/plus/${id}`;
    const minus=`htt[://localhost:3000/minus${id}`;
    if(delta>0){
      calculation(plus,id)

    }
    else{
      calculation(minus,id)
    }


  }
  
  const calculation= async function(calculation:string,id:number){
    const data=await fetch(calculation,{
      method:"PATCH",
      headers:{
        Authorization:JSON.parse(localStorage.getItem("token"))
      }
    })

    

    let spans=document.getElementById(`span_${id}`);
    spans.textContent=(Number(data.quantity)+delta >=0 ? Number(data.quantity)+delta:0).toString();

  }
  
  
  /*const handleQuantityChange = (id: number, delta: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.productId === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };*/
  const [location, setLocation] =useState<{ datas:string[] }>(null);
  //useState<{ lat: number; lng: number}> ({lat: 33.450701, lng: 126.570667 });
 
  const clicketst=()=>{
    //setLocation({lat,lng})
    setLocation({datas:["KB국민은행 상계역지점","IBK기업은행365 중계주공3단지아파트"]})
   console.log("click---test")
   
  }
  const deleteitem=(itemid:number)=>{
    const cartItems=JSON.parse(localStorage.getItem("Item_Chosen"));
    const update_item=cartItems.filter(item=>{
      if(item.productId===itemid){
        return false;
      }
      return true;
    })
    console.log("update_item:",update_item);
    localStorage.setItem("Item_Chosen",JSON.stringify(update_item));
    let li=document.getElementById(`${itemid}`);
    li.remove();

  }



  /*const delete_item_by_one=async (itemid:number)=>{
    const data=await fetch(`http://localhost:3000/cart/${itemid}`,{
      method:"DELETE",
      headers:{
        Authorization:JSON.parse(localStorage.getItem("token"))
      }
    })
    .then((res)=>{return res.json();})

    if(data.success){
    let li=document.getElementById(`${itemid}`);
    li.remove();}
    else{
      console.log("error:",data.message)
    }
  }*/

  /*const delete_item_all=async()=>{
    const data=await fetch("http://localhost:3000/cart",{
      method:"DELETE",
      headers:{
        Authorization:JSON.parse(localStorage.getItem("token"))
      }
    })
    .then((res)=>{return res.json();})

    if(data.success){
      let doc_list=document.querySelectorAll("li");
      for(const x of doc_list){
        x.remove();
      }
    }
    else{
      console.log("error:",data.message);
    }
  }*/

  

  //추후에 api에서 받아올떄를 가정한애
  //[item,setItem]=useState()
  /*useEffect(()=>{

    const fetchdata=async()=>{
      const data=await fetch("http://localhost:3000/cart",{
        method:"GET",
        headers:{
          Authorization:JSON.parse(localStorage.getItem("token"))
        }
      }).then((res)=>{return res.json();})

      setItem(data.data);
      
    }

  },[])*/




  return (
  <div className="list-container bg-transparent">
      <svg className="h-8 w-8 text-slate-500 toggle-icon"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <polyline points="7 7 12 12 7 17" />  <polyline points="13 7 18 12 13 17" /></svg>
    <div className="overlay-container">
      { hasItems ?(
                   <ul className="flex flex-col items-center divide-y divide-gray-200">

                    {cart_list.map(item => (
                      <li  id={item.productId} key={item.productId} className="w-full flex items-center p-2">
                        <input type="checkbox"></input>
                        <img src={item.productImgUrl} alt={item.productName} className="h-10 w-10 object-cover" />
                        <span className="text-white">{item.productName}</span>
                        <div className="flex items-center">
                          <button className="px-3 py-1 bg-red-300 rounded hover:bg-red-400"
                          onClick={() => handleQuantityChange(item.productId, -1)}>-</button>
                          <span id={`span_`+item.productId} className="mx-2 text-white">{item.quantity}</span>
                          <button className="px-3 py-1 bg-green-300 rounded hover:bg-green-400"
                          onClick={() => handleQuantityChange(item.productId, 1)}>+</button>
                        
                        </div>
                        <button onClick={()=>{deleteitem(item.productId)}}className="mx-2 text-white">x</button>
                      </li>
                    ))}
                  </ul>)
                : (<p>아이템없음.</p>)
        
                    
        }
        <button onClick={()=>clicketst()}>hello? {location!==null &&<Map location={location}/>}</button>
    </div>

    

    </div>


  );
};

export default CartList;
