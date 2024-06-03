'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

const MapContext = createContext(null);

export const MapProvider = ({ children }) => {
  const [kakaoMap, setKakaoMap] = useState(null);

  useEffect(() => {
    const kakao_map_api_key = process.env.NEXT_PUBLIC_JS_KEY;
    const mapScript = document.createElement('script');
    mapScript.async = true;
    mapScript.type = 'text/javascript';
    mapScript.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakao_map_api_key}&autoload=false&libraries=services`;
    document.head.appendChild(mapScript);

    mapScript.onload = () => {
      window.kakao.maps.load(() => {
        setKakaoMap(window.kakao.maps);
      });
    };

    return () => {
      document.head.removeChild(mapScript);
    };
  }, []);

  return (
    <MapContext.Provider value={kakaoMap}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => useContext(MapContext);