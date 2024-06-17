'use client';
import React,{useState, useEffect} from "react";

import Header from "../header/header";
import KakaoMap from "./map/Map";
import { MapProvider } from "./map/MapProvider";

import MainList from "./overlays/mainList";
import CheckList from "./overlays/checkList";
import CartList from "./overlays/cartList";



const MainContainer: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  //const [location, setLocation] = useState<{ lat: number; lng: number }>({ lat: 33.450701, lng: 126.570667 });
  //const [location, setLocation] =  useState<{ datas:string[] }>({datas:["KB국민은행 상계역지점","IBK기업은행365 중계주공3단지아파트","코리아세븐 세븐-중계2호 ATM"]})
  const [dayCheck,setDayCheck]=useState(false);
  const [center, setCenter] = useState({ lat: 37.566826, lng: 126.9786567 });

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

  return (
    <div className="fixed w-full h-h-screen-50">
      <MapProvider>
        <Header onItemSelected={setActiveIndex} onSetCenter={setCenter}/>
        <div className="flex mt-14 h-full">
          <div className="flex w-full">
            <KakaoMap center = {center}/>
          </div>
          <div className="flex w-fit">
            {render()}
          </div>
        </div>
      </MapProvider>
    </div>
  );
}

export default MainContainer;
