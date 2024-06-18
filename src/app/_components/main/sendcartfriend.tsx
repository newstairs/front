
import React,{useState, useEffect} from "react";



interface MapProps{
    cartlist:CartItem[],
    carttruth:cartcheck
}

interface cartcheck{
    datas:Boolean
}

interface CartItem {
    id: number;
    image: string; // 이미지 URL
    name: string; // 상품명
    mart: string; // 마트 이름
    price: number; // 가격
    quantity: number; // 초기 수량
}
interface Test{
    name:string;
}

const SendCartlist: React.FC<MapProps>=({cartlist,carttruth})=>{

    const [testlist,settestlist]=useState<Test[]>([{name:"황동근"},{name:"박종우"},{name:"이호종"},{name:"황동근"},{name:"황동근"},{name:"황동근"},{name:"황동근"}]);
    console.log("sendcartlist:",carttruth);
    console.log("carlistdata:",cartlist);

    const click=()=>{
        
        carttruth.datas=false;
        console.log("carttruth.datas:",carttruth.datas);
        const list=document.querySelectorAll(".li");
        Array.from(list).map((el,idx)=>{
            const checkbox = el.childNodes[0] as HTMLInputElement;
            if (checkbox.checked) {
                console.log(el.childNodes[1].textContent);
            }
        })
    }

    return (
   //<div className={`${carttruth.datas ? 'display:block' : 'display:none'}`}>
    <div >
        
        <div className="absolute w-[350px] h-[350px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-200 rounded-lg shadow-md overflow-scroll overflow-x-hidden">
        
            
            <button  className="sticky top-[0px] w-full bg-white rounded-lg"onClick={()=>click()}>전송하기</button>
    

            <ul className=" divide-y divide-gray-200 ">
                {testlist.map((item,idx)=>(
                    <li key={idx} className="li flex grow  p-2 bg-white rounded-lg my-5 mx-auto w-4/5 ">
                        <input className="member_check" type="checkbox"></input>
                        <span className="text-black">{item.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>

    );


}



export default SendCartlist