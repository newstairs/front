import React from "react";
import Header from "../../_components/header";

const Main: React.FC = () => {
  //switch 0 : 1: 2: 
  //0번이면 장바구니
  //1번이면 메인리스트
  //2번이면 선택리스트
  
  return (
    <div>
      <Header/>
      
      <h1>메인입니다.</h1>
    </div>
  );
}

export default Main;
