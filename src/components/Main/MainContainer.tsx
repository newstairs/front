'use client'
import React, { useState } from "react";
import Header from "../Header/Header";
// overlay 목록 불러오기
import MainList from "./Overlays/MainList";
import CheckList from "./Overlays/CheckList";
import CartList from "./Overlays/CartList";
import KakaoMap from "./Map/KakaoMap";
import { MapProvider } from "./Map/MapProvider";

const MainContainer: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [keyword, setKeyword] = useState<string>("");

  const handleSearch = (newKeyword: string) => {
    setKeyword(newKeyword);
  };

  // 품목 리스트 오버레이 랜더링 로직 
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
    <div className="flex flex-col h-screen">
      <MapProvider>
        <Header onItemSelected={setActiveIndex} onSearch={handleSearch}/>
        <div className="flex mt-14 h-map-height">
          <div className="flex w-[65%]">
            <KakaoMap keyword={keyword}/>
          </div>
          <div className="flex w-[35%]">
            {render()}
          </div>
        </div>
      </MapProvider>
    </div>
  );
}

export default MainContainer;