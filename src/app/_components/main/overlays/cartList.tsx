// import React, { useEffect, useState } from 'react';
// import '../../../styles/overlayContainer.css';
// import Map from "../map/Map";
// import FriendList from "./friendlist";

// interface CartItem {
//   productId: number;
//   productImgUrl: string;
//   productName: string;
//   quantity: number;
// }

// interface friend_data {
//   uuid: string,
//   name: string
// }

// interface Props {
//   frienddata: friend_data[],
//   item_list: CartItem[]
// }


// const CartList: React.FC = () => {
//   const [isListOpen, setIsListOpen] = useState(true); // 리스트 열림/닫힘 상태 관리
//   const [hasitems, sethasitems] = useState(false);
//   const [friendlist, setfriendlist] = useState<friend_data[]>();
//   const cart_list = JSON.parse(localStorage.getItem("Item_Chosen")) || [];
//   const hasItems = cart_list.length > 0;
//   const [location, setLocation] = useState<{ datas: string[] }>(null);
//   const [friend_onoff, setfriend] = useState(false);

//   const handleQuantityChange2 = async (id: number, delta: number) => {
//     const plus = `http://localhost:3000/cart/plus/${id}`;
//     const minus = `http://localhost:3000/cart/minus/${id}`;

//     if (delta > 0) {
//       calculation(plus, id, delta)
//     } else {
//       calculation(minus, id, delta)
//     }
//   }

//   const calculation = async function (calculation: string, id: number, delta: number) {
//     const data = await fetch(calculation, {
//       method: "PATCH",
//       headers: {
//         Authorization: "Bearer " + localStorage.getItem("access_token")
//       }
//     })
//       .then((res) => { return res.json(); })

//     if (data.success) {
//       let spans = document.getElementById(`span_${id}`);
//       const amount = (Number(data.data.quantity)) >= 1 ? (Number(data.data.quantity)) : 1;
//       spans.textContent = amount.toString();
//     } else {
//       console.log("error:", data.message);
//     }
//   }

//   const clicketst = () => {
//     setLocation({ datas: ["KB국민은행 상계역지점", "IBK기업은행365 중계주공3단지아파트"] });
//   }

//   const deleteitem = (itemid: number) => {
//     const cartItems = JSON.parse(localStorage.getItem("Item_Chosen"));
//     const update_item = cartItems.filter(item => item.productId !== itemid);
//     localStorage.setItem("Item_Chosen", JSON.stringify(update_item));
//     let li = document.getElementById(`${itemid}`);
//     li.remove();
//   }

//   const delete_item_by_one = async (itemid: number) => {
//     const data = await fetch(`http://localhost:3000/cart/${itemid}`, {
//       method: "DELETE",
//       headers: {
//         Authorization: "Bearer " + localStorage.getItem("access_token")
//       }
//     })
//       .then((res) => { return res.json(); })

//     if (data.success) {
//       let li = document.getElementById(`${itemid}`);
//       li.remove();
//     } else {
//       console.log("error:", data.message)
//     }
//   }

//   const delete_item_all = async () => {
//     const data = await fetch("http://localhost:3000/cart", {
//       method: "DELETE",
//       headers: {
//         Authorization: "Bearer " + localStorage.getItem("access_token")
//       }
//     })
//       .then((res) => { return res.json(); })

//     if (data.success) {
//       let doc_list = document.getElementsByClassName("item_list");
//       let lists = Array.from(doc_list);
//       for (const x of lists) {
//         x.remove();
//       }
//     } else {
//       console.log("error:", data.message);
//     }
//   }

//   const getfrienddata = async () => {
//     if (!friend_onoff) {
//       let datas = await fetch("http://localhost:3000/returnfriendlist", {
//         method: 'GET',
//         headers: {
//           Authorization: "Bearer " + localStorage.getItem("access_token")
//         }
//       }).then((res) => { return res.json(); })
//       let friend_data = datas.data.elements.map((x) => {
//         return {
//           uuid: x.uuid,
//           name: x.profile_nickname
//         }
//       })
//       setfriendlist( friend_data )
//       setfriend(true)
//       const data = await fetch("http://localhost:3000/cart", {
//         method: "GET",
//         headers: {
//           Authorization: "Bearer " + localStorage.getItem("access_token")
//         }
//       }).then((res) => { return res.json(); })
//       setItem(data.data);
//     } else {
//       setfriend(false);
//     }
//   }

//   const [items, setItem] = useState<CartItem[]>([]);

//   useEffect(() => {
//   const fetchdata = async () => {
//   const response = await fetch("http://localhost:3000/cart", {
//     method: "GET",
//     headers: {
//       Authorization: "Bearer " + localStorage.getItem("access_token")
//     }
//   });

//   const data = await response.json();
//   if (data && data.data && Array.isArray(data.data)) {
//     setItem(data.data);
//     sethasitems(data.data.length > 0);
//   } else {
//     setItem([]);
//     sethasitems(false);
//   }
// }
// fetchdata()
// },[]);

//   return (
//     <div className="list-container">
//       <div>
//         <button type="button" className='toggle-button' onClick={() => setIsListOpen(!isListOpen)}>
//           <svg className="h-8 w-8 text-slate-500 toggle-icon"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <polyline points="7 7 12 12 7 17" />  <polyline points="13 7 18 12 13 17" /></svg>
//         </button>
//       </div>
//       <div className={`overlay-container ${isListOpen ? 'overlay-container' : 'Close'}`}>
//         <button
//           onClick={() => getfrienddata()}
//           className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
//         >
//           친구에게 보내기
//         </button>

//         {friend_onoff && <FriendList frienddata={friendlist} item_list={items} />}

//         {hasitems ? (
//           <ul className="flex flex-col items-center divide-y divide-gray-200 space-y-4">
//             {(items || []).map(item => (
//               <li id={item.productId.toString()} key={item.productId} className="item_list w-full flex items-center p-2 bg-white rounded-lg shadow-md">
//                 <input type="checkbox" className="mr-2" />
//                 <img src={item.productImgUrl} alt={item.productName} className="h-10 w-10 object-cover mr-2" />
//                 <span className="flex-grow">{item.productName}</span>
//                 <div className="flex items-center">
//                   <button
//                     className="w-8 h-8 flex items-center justify-center bg-red-300 rounded hover:bg-red-400 mx-1"
//                     onClick={() => handleQuantityChange2(item.productId, -1)}
//                   >
//                     -
//                   </button>
//                   <span id={`span_${item.productId}`} className="mx-2">{item.quantity}</span>
//                   <button
//                     className="w-8 h-8 flex items-center justify-center bg-green-300 rounded hover:bg-green-400 mx-1"
//                     onClick={() => handleQuantityChange2(item.productId, 1)}
//                   >
//                     +
//                   </button>
//                 </div>
//                 <button
//                   onClick={() => { delete_item_by_one(item.productId) }}
//                   className="ml-2 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded hover:bg-red-600"
//                 >
//                   x
//                 </button>
//               </li>
//             ))}
//             <button onClick={() => { delete_item_all() }} className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-red-600">
//               장바구니 전체 삭제
//             </button>
//           </ul>
//         ) : (
//           <p className="text-gray-500">장바구니에 품목을 담아주세요</p>
//         )}

//       </div>
//     </div>
//   );
// };

// export default CartList;
import React, { useEffect, useState } from 'react';
import '../../../styles/overlayContainer.css';
import Map from "../map/Map";
import FriendList from "./friendlist";

interface CartItem {
  productId: number;
  productImgUrl: string;
  productName: string;
  quantity: number;
}

interface friend_data {
  uuid: string,
  name: string
}

interface Props {
  frienddata: friend_data[],
  item_list: CartItem[]
}

const CartList: React.FC = () => {
  const [isListOpen, setIsListOpen] = useState(true); // 리스트 열림/닫힘 상태 관리
  const [hasitems, sethasitems] = useState(false);
  const [friendlist, setfriendlist] = useState<friend_data[]>();
  const cart_list = JSON.parse(localStorage.getItem("Item_Chosen")) || [];
  const hasItems = cart_list.length > 0;
  const [location, setLocation] = useState<{ datas: string[] }>(null);
  const [friend_onoff, setfriend] = useState(false);

  const handleQuantityChange2 = async (id: number, delta: number) => {
    const plus = `http://localhost:3000/cart/plus/${id}`;
    const minus = `http://localhost:3000/cart/minus/${id}`;

    if (delta > 0) {
      calculation(plus, id, delta)
    } else {
      calculation(minus, id, delta)
    }
  }

  const calculation = async function (calculation: string, id: number, delta: number) {
    const data = await fetch(calculation, {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token")
      }
    })
      .then((res) => { return res.json(); })

    if (data.success) {
      let spans = document.getElementById(`span_${id}`);
      const amount = (Number(data.data.quantity)) >= 1 ? (Number(data.data.quantity)) : 1;
      spans.textContent = amount.toString();
    } else {
      console.log("error:", data.message);
    }
  }

  const clicketst = () => {
    setLocation({ datas: ["KB국민은행 상계역지점", "IBK기업은행365 중계주공3단지아파트"] });
  }

  const deleteitem = (itemid: number) => {
    const cartItems = JSON.parse(localStorage.getItem("Item_Chosen"));
    const update_item = cartItems.filter(item => item.productId !== itemid);
    localStorage.setItem("Item_Chosen", JSON.stringify(update_item));
    let li = document.getElementById(`${itemid}`);
    li.remove();
  }

  const delete_item_by_one = async (itemid: number) => {
    const data = await fetch(`http://localhost:3000/cart/${itemid}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token")
      }
    })
      .then((res) => { return res.json(); })

    if (data.success) {
      let li = document.getElementById(`${itemid}`);
      li.remove();
    } else {
      console.log("error:", data.message)
    }
  }

  const delete_item_all = async () => {
    const data = await fetch("http://localhost:3000/cart", {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token")
      }
    })
      .then((res) => { return res.json(); })

    if (data.success) {
      let doc_list = document.getElementsByClassName("item_list");
      let lists = Array.from(doc_list);
      for (const x of lists) {
        x.remove();
      }
    } else {
      console.log("error:", data.message);
    }
  }

  const getfrienddata = async () => {
    if (!friend_onoff) {
      let datas = await fetch("http://localhost:3000/returnfriendlist", {
        method: 'GET',
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token")
        }
      }).then((res) => { return res.json(); })
      let friend_data = datas.data.elements.map((x) => {
        return {
          uuid: x.uuid,
          name: x.profile_nickname
        }
      })
      setfriendlist( friend_data )
      setfriend(true)
      const data = await fetch("http://localhost:3000/cart", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token")
        }
      }).then((res) => { return res.json(); })
      setItem(data.data);
    } else {
      setfriend(false);
    }
  }




  function handlefriendset(){
    setfriend(false)
    console.log("setfriend");
  }

  const [items, setItem] = useState()


  useEffect(() => {
  const fetchdata = async () => {
  const response = await fetch("http://localhost:3000/cart", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("access_token")
    }
  });

  const data = await response.json();
  if (data && data.data && Array.isArray(data.data)) {
    setItem(data.data);
    sethasitems(data.data.length > 0);
  } else {
    setItem([]);
    sethasitems(false);
  }
}
fetchdata()
},[]);

  return (
    <div className="list-container">
      <div>
        <button type="button" className='toggle-button' onClick={() => setIsListOpen(!isListOpen)}>
          <svg className="h-8 w-8 text-slate-500 toggle-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z"/>
            <polyline points="7 7 12 12 7 17" />
            <polyline points="13 7 18 12 13 17" />
          </svg>
        </button>
      </div>
      <div className={`${isListOpen ? 'overlay-container' : 'Close'}`}>
        <div className='flex justify-center'>
            <button
          onClick={() => getfrienddata()}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-blue-600"
        >
          친구에게 보내기
        </button>
        </div>
      


        {friend_onoff && <FriendList frienddata={friendlist} item_list={items} handle_friend_set={handlefriendset} />}

       

        {hasitems ? (
          <ul className="flex flex-col items-center divide-y divide-gray-200 space-y-4">
            {(items || []).map(item => (
              <li id={item.productId.toString()} key={item.productId} className="item_list w-full flex items-center p-2 bg-white rounded-lg shadow-md">
                <input type="checkbox" className="mr-2" />
                <img src={item.productImgUrl} alt={item.productName} className="h-10 w-10 object-cover mr-2" />
                <span className="flex-grow">{item.productName}</span>
                <div className="flex items-center">
                  <button
                    className="w-8 h-8 flex items-center justify-center bg-red-300 rounded hover:bg-red-400 mx-1"
                    onClick={() => handleQuantityChange2(item.productId, -1)}
                  >
                    -
                  </button>
                  <span id={`span_${item.productId}`} className="mx-2">{item.quantity}</span>
                  <button
                    className="w-8 h-8 flex items-center justify-center bg-green-300 rounded hover:bg-green-400 mx-1"
                    onClick={() => handleQuantityChange2(item.productId, 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => { delete_item_by_one(item.productId) }}
                  className="ml-2 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded hover:bg-red-600"
                >
                  x
                </button>
              </li>
            ))}
            <button onClick={() => { delete_item_all() }} className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-red-600">
              장바구니 전체 삭제
            </button>
          </ul>
        ) : (
          <p className="flex justify-center text-gray-500">장바구니에 품목을 담아주세요</p>
        )}


      </div>
    </div>
  );
};


export default CartList;

