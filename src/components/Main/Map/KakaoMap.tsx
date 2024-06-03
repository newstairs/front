'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useMap } from './MapProvider'; 

interface Location {
  lat: number;
  lng: number;
}

interface KakaoMapProps {
  keyword: string;
}

const KakaoMap: React.FC<KakaoMapProps> = () => {
  const kakaoMap = useMap();
  const mapRef = useRef<any>(null);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

  useEffect(() => {
    if (kakaoMap) {
      // map 화면 구성 관련 설정
      const mapContainer = document.getElementById('map');
      const mapOption = {
        center: new kakaoMap.LatLng(33.450701, 126.570667),
        level: 3,
      };
      const map = new kakaoMap.Map(mapContainer, mapOption);
      mapRef.current = map;

      const mapTypeControl = new kakaoMap.MapTypeControl();
      map.addControl(mapTypeControl, kakaoMap.ControlPosition.TOPRIGHT);

      const zoomControl = new kakaoMap.ZoomControl();
      map.addControl(zoomControl, kakaoMap.ControlPosition.RIGHT);
      

      // 사용자 현 위치 정보 가져오기
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const locPosition = new kakaoMap.LatLng(lat, lon);
          const message = '<div style="padding:5px;"> 현 위치 </div>';
          displayMarker(locPosition, message);
          setCurrentLocation({ lat, lng: lon });
        });
      } else {
        const locPosition = new kakaoMap.LatLng(33.450701, 126.570667);
        const message = '현재 위치를 불러올 수 없습니다..!';
        displayMarker(locPosition, message);
        setCurrentLocation({ lat: 33.450701, lng: 126.570667 });
      }


      // 현 위치에 해당하는 마커 표시 
      const displayMarker = (locPosition: any, message: string) => {
        const marker = new kakaoMap.Marker({
          map: map,
          position: locPosition,
        });

        const infowindow = new kakaoMap.InfoWindow({
          content: message,
          removable: true,
        });

        infowindow.open(map, marker);
        map.setCenter(locPosition);
      };


      // 마커 트래킹 로직
      
      
      // 기상 정보 로직


    }
  }, [kakaoMap]);


  // 중심좌표로 이동하는 로직
  const panTo = useCallback(() => {
    if (kakaoMap && mapRef.current && currentLocation) {
      const moveLatLon = new kakaoMap.LatLng(currentLocation.lat, currentLocation.lng);
      mapRef.current.panTo(moveLatLon);
    }
  }, [currentLocation, kakaoMap]);


  // 화면에 보여줄 html
  return (
    <div className='relative flex w-full h-full'>
      <div id="map" className="relative inset-0 w-full h-full"></div>
      <button
        onClick={panTo}
        className="absolute flex justify-center w-[45px] z-10 bottom-4 right-4 bg-white p-2 rounded shadow"
      >
        <img width='20px' src='./images/myLocation.png' />
      </button>
    </div>
  );
};

export default KakaoMap;