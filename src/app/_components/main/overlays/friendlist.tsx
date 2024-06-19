import React, { useEffect, useState } from 'react';
import "../../../styles/scroll.css";

interface friend_data{
    uuid:string,
    name:string
}

interface Friendlist{
    frienddata:friend_data[],
    item_list: CartItem[],
    handle_friend_set:()=>void
}

interface CartItem{
    productId:number,
    productImgUrl:string,
    productName:string,
    quantity:number
}


const FriendList: React.FC<Friendlist> = ({frienddata, item_list, handle_friend_set}) => {
    console.log("frienddata:",frienddata);
    console.log("item_list:",item_list);

    const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI

    const send_cartlist_to_friend=async ()=>{
        let x=document.querySelectorAll(".friend_list");
        let sendlist=Array.from(x).filter((item)=>{
            const checkbox = item.children[0] as HTMLInputElement;
            if(checkbox.checked){
                console.log(item.id);
                return true;
            }
            return false;
        })
        let martlist=document.querySelectorAll(".mart_list")//Array.from(document.querySelectorAll(".mart_list"));
        let mart_Address;
        let mart_id;
        let martname;
        for(const x of martlist){
            const radio = x.children[0] as HTMLInputElement;
            if(radio.checked){
                mart_Address=radio.value;
                mart_id=radio.id
                martname=x.textContent;
                console.log("mart_id:",mart_id);
            }
        }

        console.log("mart_address:",mart_Address);
    
    
    

        let uuid_list=sendlist.map((x)=>{return x.id});
        console.log("uud_list:",uuid_list);
        let s=await fetch(`${BACKEND_URI}/sendmsgtofriend`,
            {method:'POST',
                headers:{
                    'Content-Type':"application/json",
                    Authorization:"Bearer "+localStorage.getItem("access_token")},
                body:JSON.stringify({
                                mart_id:mart_id,
                                mart_address:mart_Address,
                                friend_uuid:uuid_list,
                                item_list:item_list,
                                martname:martname
            })})
            .then((res)=>{return res.json();})


        console.log("s:",s)      
    }

    const find_memeber=()=>{


        let doc=document.getElementById("member_find") as HTMLInputElement;


        let doc2=document.getElementById("show_box");
        if(doc.value===""){
            doc2.className="absolute hidden w-1/2 right-0 bg-red-400 "

        }
        else{
            const find_list=frienddata.filter((mem)=>{
                if(mem.name.includes(doc.value)){
                    return true;
                }
                return false;
            })
        
            
            let doc2_child=Array.from(doc2.children)
            for(let x of doc2_child){
                x.remove();
            }
        
            if(find_list.length>0){  
            doc2.className="absolute w-1/2 bg-white right-0 z-20"
            console.log("findlist:",find_list);
            for(let x of find_list){
                let doc3=document.createElement("div");
                doc3.textContent=x.name;
                doc2.appendChild(doc3);
                doc3.addEventListener("click",()=>{
                    let y=document.getElementById(`${x.uuid}`) as HTMLInputElement;
                    console.log(y.children[0]); 
                    (y.children[0] as HTMLInputElement).checked=true;
                })
                
            }
            
            }
            else{
                doc2.className="absolute hidden w-1/2 right-0  bg-white "
            }
        }
    }
    const mart_list=JSON.parse(window.localStorage.getItem("mart_around"));


    const mouseup=(event)=>{
     
      let doc=document.getElementById("show_name");
      doc.className="fixed top-0 left-0  rounded-lg bg-slate-200"
      doc.textContent=event.target.textContent;
    
    }
    const mousedown=(event)=>{
        let doc=document.getElementById("show_name");
        doc.className=" hidden fixed top-0 left-0 bg-white"
   
        
        
    }

 return  (
    <div className="absolute w-[400px] h-[250px]   bg-blue-300 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-100 "> 

        
        <button className="bg-white w-1/4 sticky top-0 right-0 rounded-lg"onClick={()=>{handle_friend_set()}}>닫기</button>
        <button className="w-1/4 bg-white sticky top-0 left-0 rounded-lg"onClick={()=>{send_cartlist_to_friend()}}>전송하기</button>
        <input id="member_find"className="rounded-lg w-1/2 border-[1px] my-[2px] border-black" placeholder="친구 이름을 입력해주세요" type="text" onChange={()=>{find_memeber()}}></input>
        <div id="show_box" className="absolute right-0 hidden w-1/2  bg-white "></div>

        <div className="flex justify-normal h-[245px]">
        <div id="show_name" className="fixed bottom-[-24px] left-0 hidden"></div>
        <div id="show_mart_list" className="w-1/2 h-auto bg-blue-200 scrollbar overflow-scroll overflow-x-hidden">
            
            <form>
            
            {
                <ul id="show_mart_ul">
                    {
                        mart_list.map((x)=>(

                            <li  key={x.id} className="mart_list  overflow-hidden whitespace-nowrap text-ellipsis  border-b-[2px] border-slate-400  w-full h-[20px] my-[5px]" onMouseOver={(event)=>{mouseup(event)}} onMouseOut={(event)=>{mousedown(event)}}>
                                <input id={x.martId} className="checkbox" type="radio" value={x.martAddress} name="mart" ></input>{x.martName}
                                


                            </li>
 
                            ))
                    }

                </ul>
            }


            </form>
           
        </div>
        
        
        <div id="show_friend_list" className="w-1/2 bg-blue-200  h-auto scrollbar overflow-scroll overflow-x-hidden">
        {
            <ul>
                {
                    frienddata.map(x=>(


                        <li id={x.uuid} key={x.uuid} className="friend_list my-[5px]  border-b-[2px] border-slate-400  w-full h-[20px]">
                            <input className="checkbox" type="checkbox"></input>{x.name}
                        </li>

                    ))
                }
            </ul>
        }
        </div>
        </div>

        
       
    </div>)


}


export default FriendList;