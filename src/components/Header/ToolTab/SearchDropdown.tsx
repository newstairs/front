'use client'
import React, { useState } from 'react'

const SearchDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [logoutAction, setLogoutAction] = useState<boolean>(false);

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

  return (
    <div className="dropdown relative w-[100px] ml-4 p-2 bg-white">
      <button className='dropdownBtn w-full' onClick={toggleDropdown}>ToolTab</button>
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
              <input className="border" type='text' placeholder='주소를 입력하세요.'/>
              <button className='searchBtn'>검색</button>
            </div>

            {/* 검색결과를 보이는 목록 */}
            <div className='searchResultLists flex-col p-2 '>

            </div>
            <button className='closeBtn mt-4 p-2 bg-red-500 text-white rounded' onClick={closeModal}> 확인 </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchDropdown;