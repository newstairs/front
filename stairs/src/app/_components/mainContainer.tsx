'use client';
import React,{useState, useEffect} from "react";
import Header from "./header";
import Map from "./map/Map";
import MainList from "./overlays/mainList";
import CheckList from "./overlays/checkList";
import CartList from "./overlays/cartList";


const MainContainer: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);

  useEffect(() => {
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
  const handleLocationChange = (lat, lng) => {
    setLocation({ lat, lng });
  };
  
  return (
    <div className="flex pt-14">
      <Header onLocationChange={handleLocationChange} onItemSelected={setActiveIndex} />
      <div className=" flex flex-1">
        <div className="flex-1">
          <Map location={location}/>
        </div>
        <div className="overlay w-[33%]">
          {render()}
        </div>
      </div>
    </div>
  );
}

export default MainContainer;
