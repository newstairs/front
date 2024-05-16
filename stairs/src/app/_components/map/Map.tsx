"use client"

import React, { useEffect } from 'react';

const Map = () => {
  const kakao_map_api_key = process.env.NEXT_PUBLIC_JAVASCRIPT_API_KEY;
  useEffect(() => {
    // Kakao Maps 스크립트 동적 로드
    const script = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${kakao_map_api_key}`;
    document.head.appendChild(script);

    // 스크립트 로드 완료 후 지도 생성
    script.onload = () => {
      kakao.maps.load(() => {
        let container = document.getElementById('map');
        let options = {
          center: new kakao.maps.LatLng(33.450701, 126.570667),
          level: 3
        };
        const map = new kakao.maps.Map(container, options);

        const mapTypeControl = new kakao.maps.MapTypeControl();
        map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPLEFT);  // 올바르게 `map` 참조

        const zoomControl = new kakao.maps.ZoomControl();
        map.addControl(zoomControl, kakao.maps.ControlPosition.LEFT);
      });
    };

    // 컴포넌트 언마운트 시 스크립트 제거
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className='relative w-full h-screen-50 '>
      <div id="map" className="relative inset-0 w-full h-full"></div>
    </div>
  );
}

export default Map;
