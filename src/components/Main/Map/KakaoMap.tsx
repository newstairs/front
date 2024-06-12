'use client'
import React, { useEffect, useState } from 'react'
import { useMap } from './MapProvider'

const MapComponent = ({center}) => {
  const kakaoMap = useMap(); // MapProvider에서 제공하는 kakaoMap 객체를 가져옵니다.

  const [map, setMap] = useState(null); // map 상태를 초기화합니다.

  // 카카오맵 기능을 위한 함수 모음

  // 카카오맵 동작 hook
  useEffect(() => {
    if (kakaoMap && !map) {
      // 지도 설정 및 표시할 div 설정
      const container = document.getElementById('map'); 
      const options = {
        center: new kakaoMap.LatLng(37.566826, 126.9786567),
        level: 3,
      };
      const newMap = new kakaoMap.Map(container, options);
      setMap(newMap);

      
      // 지도가 설정된 이후 컨트롤을 로딩하기
      if (newMap) {
        // 사용자 컨트롤
        const mapTypeControl = new kakaoMap.MapTypeControl();
        // 지도에 컨트롤을 추가
        newMap.addControl(mapTypeControl, kakaoMap.ControlPosition.TOPLEFT);

        // 지도 확대 축소를 제어할 수 있는 줌 컨트롤을 생성
        const zoomControl = new kakaoMap.ZoomControl();
        newMap.addControl(zoomControl, kakaoMap.ControlPosition.LEFT);
      }

    }
  }, [kakaoMap, map])

  useEffect(() => {
    if (map && center) {
      const moveLatLon = new kakaoMap.LatLng(center.lat, center.lng);
      map.setCenter(moveLatLon);
    }
  }, [center, map]);

  function panTo () {
    // 이동할 위도 경도 위치를 생성합니다 
    var moveLatLon = new kakaoMap.LatLng(center.lat, center.lng);
    
    // 지도 중심을 부드럽게 이동시킵니다
    // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
    map.panTo(moveLatLon); 
  }

  return (
    <div className="relative w-full max-h-screen">
      <div id="map" className="relative inset-0 w-full h-full"></div>
      <button className="flex justify-center absolute w-[40px] bottom-6 left-4 p-2 bg-white rounded-lg shadow-md z-10" onClick={panTo}>
        <img src='./images/myLocation.png' alt='내 위치' />
      </button>
    </div>
  )
}

export default MapComponent