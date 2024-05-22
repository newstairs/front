'use client';
import React, { useEffect, useRef } from 'react';

interface Location {
  lat: number;
  lng: number;
}

interface MapProps {
  location: Location;
}

const Map: React.FC<MapProps> = ({ location }) => {
  const kakao_map_api_key = process.env.NEXT_PUBLIC_JAVASCRIPT_API_KEY;
  const mapRef = useRef<kakao.maps.Map | null>(null);

  useEffect(() => {
    // Kakao Maps 스크립트 동적 로드
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${kakao_map_api_key}`;
    document.head.appendChild(script);

    // 스크립트 로드 완료 후 지도 생성
    script.onload = () => {
      if (typeof window !== 'undefined' && window.kakao) {
        window.kakao.maps.load(() => {
          const { lat, lng } = location || { lat: 33.450701, lng: 126.570667 };
          const container = document.getElementById('map');
          const options = {
            center: new window.kakao.maps.LatLng(lat, lng),
            level: 3,
          };
          const map = new window.kakao.maps.Map(container, options);
          mapRef.current = map; // map 객체를 ref로 저장

          // 마커 추가
          const markerPosition = new window.kakao.maps.LatLng(lat, lng);
          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
          });
          marker.setMap(map);

          // 사용자 컨트롤 추가
          const mapTypeControl = new window.kakao.maps.MapTypeControl();
          map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPLEFT);

          const zoomControl = new window.kakao.maps.ZoomControl();
          map.addControl(zoomControl, window.kakao.maps.ControlPosition.LEFT);
        });
      }
    };

    // 컴포넌트 언마운트 시 스크립트 제거
    return () => {
      document.head.removeChild(script);
    };
  }, [location, kakao_map_api_key]);

  const panTo = () => {
    // 이동할 위도 경도 위치를 생성합니다
    if (typeof window !== 'undefined' && window.kakao && mapRef.current) {
      const { lat, lng } = location || { lat: 33.450701, lng: 126.570667 };
      const moveLatLon = new window.kakao.maps.LatLng(lat, lng);

      // 지도 중심을 부드럽게 이동시킵니다
      // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
      mapRef.current.panTo(moveLatLon);
    }
  };

  return (
    <div className="relative w-full h-screen-50">
      <div id="map" className="relative inset-0 w-full h-full"></div>
      <button
        onClick={panTo}
        className="flex justify-center absolute w-[40px] bottom-6 left-4 p-2 bg-white rounded-lg shadow-md z-10"
      >
        <img src="/utils/myLocation.png" width={15} height={40} />
      </button>
    </div>
  );
};

export default Map;
