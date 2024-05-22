'use client';
import React, { useState, ChangeEvent, FormEvent } from "react";

interface HeaderProps {
  onLocationChange: (lat: number, lng: number) => void;
  onItemSelected: (index: number) => void;  // 콜백 함수 타입 정의
}

const Header: React.FC<HeaderProps> = ({ onLocationChange, onItemSelected }) => {
  const [location, setLocation] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [activeIndex, setActiveIndex] = useState<number>(0); 
  const items: string[] = ["메인 품목 리스트", "마트 별 선택 항목", "장바구니"];

  const handleClick = (index: number, item: string): void => {
    console.log(`Clicked item: ${items[index]}, Index: ${index}`);
    onItemSelected(index);  
    setActiveIndex(index);  
  }

  // 현 위치 입력 관련 이벤트
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // 주소 검색 API 호출
    if (typeof window !== 'undefined' && window.kakao && window.kakao.maps && window.kakao.maps.services) {
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(query, (result: kakao.maps.services.GeocoderResult[], status: kakao.maps.services.Status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const { y: lat, x: lng } = result[0];
          onLocationChange(lat, lng);
        } else {
          alert('검색 결과가 없습니다.');
        }
      });
    } else {
      alert('Kakao Maps API를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <header className="fixed top-0 w-full shadow-md">
      <div className="flex justify-between">
        <div className="flex items-center pl-6">
          <button className="">로그아웃</button>
        </div>
        <div className="flex items-center">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={query}
              onChange={handleChange}
              placeholder="현 위치를 입력하세요."
            />
            <button type="submit">Submit</button>
          </form>
        </div>
        <div>
          <ul className="flex space-x-4 p-4">
            {items.map((item, index) => (
              <li key={index} onClick={() => handleClick(index, item)}
                  className={`cursor-pointer ${index === activeIndex ? 'text-blue-500' : 'text-white-700'}`}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;