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
    const mapScript = document.createElement('script');
    mapScript.async = true;
    mapScript.type = 'text/javascript';
    mapScript.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_JS_KEY}&autoload=false&libraries=services`;
    document.head.appendChild(mapScript);

    mapScript.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          setKakaoMap(window.kakao.maps);
          console.log('Kakao Maps API loaded successfully');
        });
      } else {
        console.error('Kakao Maps API is not available');
      }
    };
  }, []);

  return (
    <MapContext.Provider value={kakaoMap}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => useContext(MapContext);