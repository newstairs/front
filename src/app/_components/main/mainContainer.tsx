'use client';
import React,{useState, useEffect} from "react";
import Header from "../header/header";
import Map from "./map/Map";
import MainList from "./overlays/mainList";
import CheckList from "./overlays/checkList";
import CartList from "./overlays/cartList";


const MainContainer: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  //const [location, setLocation] = useState<{ lat: number; lng: number }>({ lat: 33.450701, lng: 126.570667 });
  const [location, setLocation] =  useState<{ datas:string[] }>({datas:["KB국민은행 상계역지점","IBK기업은행365 중계주공3단지아파트","코리아세븐 세븐-중계2호 ATM"]})//useState<{ lat: number; lng: number }>({ lat: 33.450701, lng: 126.570667 });
  const [kakaoLoaded, setKakaoLoaded] = useState(false);
  const [dayCheck,setDayCheck]=useState(false);

  const day_mem=()=>{
    const now=new Date();
    localStorage.setItem("day_check",JSON.stringify(24*60**60*1000+now.getTime()));
    setDayCheck(true);
  }
  const just_close=()=>{
    setDayCheck(true);
  }
  useEffect(() => {

    const now=new Date();
    JSON.parse(localStorage.getItem("day_check"))>now.getTime() ? setDayCheck(true):setDayCheck(false);



    const script = document.createElement('script');
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${process.env.NEXT_PUBLIC_JAVASCRIPT_API_KEY}&libraries=services`;
    script.onload = () => {
      window.kakao.maps.load(() => {
        setKakaoLoaded(true);
      });
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);
  //switch 0 : 1: 2: 
  //0번이면 장바구니
  //1번이면 메인리스트
  //2번이면 선택리스트
  const render = () =>{
    switch(activeIndex){
      case 0:
        return <MainList/>;
      case 1:
        return <CheckList/>;
      case 2:
        return <CartList/>;
      default:
        return <MainList/>;
    }
  }

  // 지도 현 위치 props값 전달
  const handleLocationChange = (lat: number, lng: number) => {
    
    //setLocation({ lat, lng });
  };
  
  return (
    <div className="flex pt-14">
      <Header onLocationChange={handleLocationChange} onItemSelected={setActiveIndex} />
      {!dayCheck &&
        <div className="w-[300px] h-[300px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white z-50">
          <input type="checkbox" onClick={()=>day_mem()}/>
          <button onClick={()=>just_close()} className="w-[50px] h-[50px] bg-slate-100">x</button>
          Hello
        </div>}
      <div className=" flex flex-1">
        <div className="flex-1">
          <Map location={location}/>
        </div>
          {render()}
      </div>
    </div>
  );
}

export default MainContainer;
