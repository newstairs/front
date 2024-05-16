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

  return (
    <div className="flex pt-14">
      <Header onItemSelected={setActiveIndex}/>
      <Map/>
      <div className="overlay-container">
        {render()}
        {/* <CheckList /> */}
        {/* <CartList/> */}
        {/* <MainList/> */} 
      </div>
    </div>
  );
}

export default MainContainer;
