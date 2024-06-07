import React from 'react'
import StarMarker from '../../_components/review/StarMarker'

const PostReviewPage = () => {
  return (
    <div className='flex-col justify-center items-center'>
      <div className='ml-[25%] w-[50%] h-screen'>
        <p className='pt-10'>이마트 임의의 지점</p>
        <p>마트 사진이 들어올 예정</p>
        {/* 별점 입력 기능 */}
        <StarMarker />

        {/* 상세 리뷰 작성 칸 */}
        <label for="message" className="block mb-2 font-medium text-gray-900">상세 리뷰를 작성해주세요</label>
        <textarea id="message" rows="4" minLength={15} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 resize-none" placeholder="마트의 어떤 점이 좋았나요? 판매하는 상품의 품질은 어떤가요? 15자 이상 작성해주세요."></textarea>

        {/* 필요시 사진 추가 */}
        <div className='mt-5'>
          <p className="block mb-2 font-medium text-gray-900">사진을 등록해주세요</p>
          <div className="rounded-md border  bg-gray-50 p-4 shadow-md w-24 h-24 mt-2">
            <label for="upload" className="justify-center h-full flex flex-col items-center gap-2 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </label>
            <input id="upload" type="file" className="hidden" />
          </div>
        </div>
        {/* 작성 완료 버튼 */}
        <div className='flex justify-center'>
          <button className="mt-5 bg-transparent hover:bg-gray-500  font-semibold hover:text-white py-2 px-4 border border-black hover:border-transparent rounded">
            등록하기
          </button>
        </div>
      </div>
    </div>
  )
}

export default PostReviewPage