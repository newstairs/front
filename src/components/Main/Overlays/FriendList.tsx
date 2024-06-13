import React, { useEffect, useState } from 'react';


interface friend_data{
  uuid:string,
  name:string
}

interface friend_data_list{
  friend_datas:friend_data[]
}

interface Friendlist{
  frienddata:friend_data_list
  item_list:items
}

interface items{
  items:item[]
}

interface item{
  productId:number,
  productImgUrl:string,
  productName:string,
  quantity:number
}

const FriendList: React.FC<Friendlist> = ({frienddata,item_list}) => {
  console.log("item_list:",item_list);
  const send_cartlist_to_friend=async ()=>{
    let x=document.querySelectorAll(".friend_list");
    let sendlist=Array.from(x).filter((item)=>{
      if(item.children[0].checked){
        console.log(item.id);
        return true;
      }
      return false;
    })

    let uuid_list=sendlist.map((x)=>{return x.id});
    console.log("uud_list:",uuid_list);
    let s=await fetch("http://localhost:3000/sendmsgtofriend",
      {method:'POST',
        headers:{
          'Content-Type':"application/json",
          Authorization:"Bearer "+localStorage.getItem("access_token")},
        body:JSON.stringify({
          friend_uuid:uuid_list,
          item_list:item_list
        })})
        .then((res)=>{return res.json();})
      console.log("s:",s)      
    }
  let x=frienddata.friend_datas;
  console.log(x);

  const find_memeber=()=>{

    let doc=document.getElementById("member_find");
      
    const find_list=x.filter((mem)=>{
      if(mem.name===doc.value){
        return true;
      }
      return false;
    })

    let doc2=document.getElementById("show_box");
    let doc2_child=Array.from(doc2.children)
    for(let x of doc2_child){
        x.remove();
    }

    if(find_list.length>0){  
      doc2.className="absolute w-[200px]  bg-red-400 overflow-scroll overflow-x-hidden"
      console.log("findlist:",find_list);
      for(let x of find_list){
        let doc3=document.createElement("div");
        doc3.textContent=x.name;
        doc2.appendChild(doc3);
        doc3.addEventListener("click",()=>{
          let y=document.getElementById(`${x.uuid}`)
          console.log(y.children[0]); 
          y.children[0].checked=true;
        })
      }
    } else{
      doc2.className="absolute hidden w-[200px]  bg-red-400 overflow-scroll overflow-x-hidden"
    }
  }


  return  (
    <div className="absolute w-[200px] h-[200px]   bg-slate-500 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-100 overflow-scroll overflow-x-hidden "> 
      <input id="member_find" placeholder="검색칸" type="text" onChange={()=>{find_memeber()}}></input>
      <div id="show_box" className="absolute hidden w-[200px]  bg-red-400 overflow-scroll overflow-x-hidden"></div>
      {
        <ul className="">
          {
            x.map(x=>(
              <li id={x.uuid} key={x.uuid} className="friend_list bg-white rounded-lg w-full h-[20px]">
                  <input className="checkbox" type="checkbox"></input>{x.name}
              </li>
            ))
          }
        </ul>
      }
      <button onClick={()=>{send_cartlist_to_friend()}}>제출하기</button>
    </div>
  )
}


export default FriendList;