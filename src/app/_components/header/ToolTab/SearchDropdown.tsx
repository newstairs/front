'use client'
import React, { useState } from 'react'
import { useMap } from '../../../_components/main/map/MapProvider';

interface SearchDropdownProps {
  onSetCenter: (center: { lat: number, lng: number }) => void;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({ onSetCenter }) => {
  const kakaoMap = useMap(); // MapProvider에서 제공하는 kakaoMap 객체를 가져옵니다.

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [logoutAction, setLogoutAction] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>('');
  const [places, setPlaces] = useState<any[]>([]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  }

  const openModal = () => {
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
  }

  const handleClickLogout = () => {
    setLogoutAction(!logoutAction);
  }

  const handleSearch = () => {
    if (!keyword.trim()) {
      alert('키워드를 입력해주세요!');
      return;
    }

    // 장소 검색 객체를 생성합니다
    const geocoder = new kakaoMap.services.Geocoder();

    // 주소로 장소를 검색합니다
    geocoder.addressSearch(keyword, (result, status) => {
      if (status === kakaoMap.services.Status.OK) {
        setPlaces(result);
      } else if (status === kakaoMap.services.Status.ZERO_RESULT) {
        alert('검색 결과가 존재하지 않습니다.');
      } else if (status === kakaoMap.services.Status.ERROR) {
        alert('검색 결과 중 오류가 발생했습니다.');
      }
    });
  }

  const handleSetCenter = (lat, lng) => {
    onSetCenter({lat, lng});
    closeModal(); // 설정 후 모달을 닫습니다.
    setIsOpen(!isOpen)
  };

  return (
    <div className="dropdown relative w-[100px] ml-4 p-2 bg-white">
      <button className='flex justify-center items-center dropdownBtn w-full' onClick={toggleDropdown}>
        <img className='w-5' src='./utils/menu.png' alt='ToolTab' />
      </button>
      {isOpen && (
        <div className='dropdownMenu flex flex-col absolute w-full bg-inherit p-2 -ml-2 justify-center item-center'>
          <button onClick={openModal}>내 위치 변경</button>
          <button className='dropdownItem pt-1 pb-1' onClick={handleClickLogout}> 로그아웃 </button>
        </div>
      )}

      {isModalOpen && (
        <div className='modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='modalContent w-[300px] bg-white p-5 rounded'>
            {/* 상단 nav 바 */}
            <div className='flex justify-between'>
              <h2>내 위치 설정</h2>
              <button onClick={closeModal}> X </button>
            </div>

            {/* 주소 입력 창 */}
            <div className='searchTab'>
              <input
                className="border"
                type='text'
                placeholder='주소를 입력하세요.'
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button className='searchBtn' onClick={handleSearch}>검색</button>
            </div>

            {/* 검색결과를 보이는 목록 */}
            <div className='searchResultLists flex-col p-2 '>
              <ul id="placesList">
                {places.map((place, index) => (
                  <li key={index}>
                    <div className="info">
                      <h5>{place.address_name}</h5>
                      <span>{place.road_address_name || place.address_name}</span>
                      <button onClick={() => handleSetCenter(place.y, place.x)}>설정</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <button className='closeBtn mt-4 p-2 bg-red-500 text-white rounded' onClick={closeModal}> 닫기 </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchDropdown;