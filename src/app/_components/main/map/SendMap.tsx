
'use client'
import React, { useEffect, useState } from 'react'
import { useMap } from './MapProvider'




interface MapProps{
    address:string
    martid:number
    martname:string

}


const SendMap:React.FC<MapProps> = ({address,martid,martname}) => {
    const kakaoMap = useMap();
    let adds=decodeURI(address);
    let mart_name=decodeURI(martname);
    
    let cart_data;
    let cart_data2;
    async function getcartlist(){
    const cart_data=await fetch(`http://localhost:3000/marts/selling/${martid}`, {
        method:'GET',
        headers:{
            Authorization:"Bearer "+localStorage.getItem("access_token")
        }
      })
      .then((res)=>{
        return res.json();
      })
      console.log("data:",cart_data);
      return cart_data;
    }
    async function getcartlist2(){
        const cart_data=await fetch(`http://localhost:3000/cart`, {
            method:'GET',
            headers:{
                Authorization:"Bearer "+localStorage.getItem("access_token")
            }
          })
          .then((res)=>{
            return res.json();
          })
          console.log("data2:",cart_data);
          return cart_data;
    }
    async function getadd(a:string){
        let data=await fetch(`https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURI(a)}`,{
                method:"GET",
                headers:{
                    Authorization:`KakaoAK ${process.env.NEXT_PUBLIC_REST_API_KEY}`
                }
        }).then((res)=>{return res.json();})
        return data;
    }   

    
    useEffect(() => {
        const mapScript = document.createElement('script');
        mapScript.async = true;
        mapScript.type = 'text/javascript';
        mapScript.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_JS_KEY}&autoload=false&libraries=services`;
        document.head.appendChild(mapScript);
    
        mapScript.onload =async () => {
            
        let data=await getadd(adds);
               
        let origin_cord=[data.documents[0].y,data.documents[0].x];
        console.log(origin_cord);
        let container=document.getElementById("map");
        let mapOption = { 
                center: new kakao.maps.LatLng(Number(origin_cord[0]),Number(origin_cord[1])), // 지도의 중심좌표
                level: 3 // 지도의 확대 레벨
            };

        var map = new kakao.maps.Map(container, mapOption); 
        let marker = new kakao.maps.Marker({
            map: map,
            position: new kakao.maps.LatLng(Number(origin_cord[0]),Number(origin_cord[1])),
          })
        
        cart_data=await getcartlist();
        cart_data2=await getcartlist2();
        //getcartlist();

        const over_lay_main=document.createElement("div");
       
        const over_lay_star=document.createElement("div");
        const over_lay_cart_list=document.createElement("div")
        const over_lay_cart_list_btn=document.createElement("button");
    
        over_lay_main.className = "bg-white rounded-lg shadow-lg p-4 w-[200px] h-[250px] relative";
      
        over_lay_cart_list_btn.className = "bg-blue-500 text-white rounded-full w-[40px] h-[40px] absolute right-2 bottom-2";
        over_lay_cart_list.className = "bg-amber-400 rounded-lg shadow-lg w-[250px] h-[250px] p-2 absolute bottom-[60px] left-[-20px] z-30 overflow-auto hidden";
        over_lay_star.className = "flex justify-center items-center bg-slate-500 text-white rounded-b-lg w-full h-[40px] absolute bottom-0 left-0"; 
        over_lay_cart_list_btn.innerText = "자세히";
        
        over_lay_cart_list_btn.addEventListener("click",async ()=> {
          if(over_lay_cart_list.style.display==="none") {
            over_lay_cart_list.style.display="block";
            if(over_lay_cart_list.children.length===0) {
              console.log("line=0");
    
              const data=cart_data
             
              if(data.success){

                for(let i=0;i<data.data.length;i++){

                    let lists=document.createElement("li");
                    lists.textContent=data.data[i].productName+" "+data.data[i].finalPrice+"원"+" "+cart_data2.data[i].quantity+"개"; 
                    lists.className="text-wrap";
                    over_lay_cart_list.appendChild(lists);

                }

   
               //over_lay_serve.textContent+=(mart_price_all_data[martid]+"원");
              }
              else{
                //over_lay_serve.textContent="없음";
                let lists=document.createElement("li");
                lists.className="text-wrap"
                lists.textContent="오류가 발생했습니다. 다시시도해주세요"
                over_lay_cart_list.appendChild(lists);
              }
            }
            else {
            }
            over_lay_cart_list_btn.innerText="닫기";
          }
          else{
            over_lay_cart_list.style.display="none";
                            
            if(over_lay_cart_list.children.length>0){
                let childs=Array.from(over_lay_cart_list.children);
    
                for(const x of childs){
                    x.remove();
                }
            }
            over_lay_cart_list_btn.innerText="자세히";
          }
        })


        function makestar(score: number) {
            const a = document.createElement("a");
            score=Math.floor(score);
            let star="";
            for(let i=0;i<5;i++){
                score>i ? star+="★" :star+="☆"
            }
            a.textContent=star;
            a.style.color="red";
            a.target="_blank";
            let m="http://localhost:3000/reviews/deatil/35"
            console.log("test:","http://localhost:3000/detail/35".substring(30,m.length))
            a.href=`http://localhost:3000/reviews/detail/${martid}`;
            //over_lay_star.appendChild(a);
          }
          makestar(4.5);
      
          console.log("martId:",martid);
   
      
          over_lay_main.appendChild(over_lay_star);
          over_lay_main.appendChild(over_lay_cart_list_btn);
          over_lay_main.appendChild(over_lay_cart_list);
      
          var customOverlay = new window.kakao.maps.CustomOverlay({
            map: map,
            clickable: true,
            content: over_lay_main,
            position: new window.kakao.maps.LatLng(Number(origin_cord[0]),Number(origin_cord[1])),
            range: 500,
            xAnchor: 1,
            yAnchor: 1,
            zIndex: 3
          });
      


          let place_name_li=document.createElement("li");
          place_name_li.className="text-wrap"
          place_name_li.textContent=mart_name;
      

       
      
          let total_price=document.createElement("li");
         
          let price_tot:number=0;
          for(let i=0;i<cart_data.data.length;i++){

            console.log(Number(cart_data.data[i].finalPrice)*Number(cart_data2.data[i].quantity));
            price_tot+=Number(cart_data.data[i].finalPrice)*Number(cart_data2.data[i].quantity)
            console.log(price_tot);
          }
         
          total_price.textContent=price_tot.toString()+"원";
          //total_price.textContent=price_all+"원"
      
      
          over_lay_main.appendChild(place_name_li);
          over_lay_main.appendChild(total_price);
          function func(){
            if(customOverlay.getMap()===null){
                customOverlay.setMap(map)

            }
            else{
                customOverlay.setMap(null);
            }
          }
          window.kakao.maps.event.addListener(marker, 'click', func);
          

        };
      }, []);
    






    return (<div className="w-full h-full">
        <div id="map" className="w-full h-full">

        </div>
    </div>)
}




export default SendMap