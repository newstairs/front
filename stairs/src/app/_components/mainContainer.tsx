'use client';
import React,{useState} from "react";
import Header from "./header";
import Map from "./map/Map";
import MainList from "./overlays/mainList";
import CheckList from "./overlays/checkList";
import CartList from "./overlays/cartList";


const MainContainer: React.FC = () => {

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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
  //switch 0 : 1: 2: 
  //0번이면 장바구니
  //1번이면 메인리스트
  //2번이면 선택리스트
  
  return (
    <div className="flex pt-16">
      <Header/>
      <Map/>
      <CartList/>
    </div>
  );
}

export default MainContainer;
