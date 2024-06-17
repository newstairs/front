'use client'
import React, { useState, ChangeEvent } from 'react'
import MakeStar from './StarMarker'

const PostReview = () => {
  const [starRating, setStarRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [image, setImage] = useState(null);
  
  const martId = 1 // 임의의 마트 id이다.

  const Link = `/reviews/detail/${martId}`

  // api 통신 로직은 수정예정이다.(마트 이름과 마트 정보를 가져와야하는 추가 보수 사항이 존재)
  const handleReviewSubmit = async () => {
    const formData = new FormData();
    formData.append('reviewContent', reviewText);
    formData.append('score', starRating.toString());
    formData.append('martId', martId.toString());
    // if (image) {
    //   formData.append('image', image);
    // }
    if(starRating === 0) {
      alert('별점을 선택해주세요');
      return;
    }
    else {
      try {
        const response = await fetch('/reviews/:id', {
          method: 'POST',
          body: formData
        });
  
        if (response.ok) {
          window.location.href = Link;
          console.log('리뷰 작성 완료');
        } else {
          console.error('리뷰 작성 실패');
        }
      } catch (error) {
        console.error('오류 발생:', error);
      }
    }
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImage(event.target.files[0]);
    }
  };


  return (
    <div className='flex-col justify-center items-center'>
      <div className='ml-[25%] w-[50%] h-screen'>
        <p className='pt-10'>리뷰 할 마트명</p>
        {/* 별점 입력 기능 */}
        <MakeStar setStarRating={setStarRating}/>

        {/* 상세 리뷰 작성 칸 */}
        <label htmlFor="message" className="block mb-2 font-medium text-gray-900">상세 리뷰를 작성해주세요</label>
        <textarea 
          id="message" 
          rows={4} 
          minLength={15} 
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 resize-none" 
          placeholder="마트의 어떤 점이 좋았나요? 판매하는 상품의 품질은 어떤가요? 15자 이상 작성해주세요."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        >
        </textarea>

        {/* 필요시 사진 추가 */}
        {/* <div className='mt-5'>
          <p className="block mb-2 font-medium text-gray-900">사진을 등록해주세요</p>
          <div className="rounded-md border  bg-gray-50 p-4 shadow-md w-24 h-24 mt-2">
            <label htmlFor="upload" className="justify-center h-full flex flex-col items-center gap-2 cursor-pointer">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth="1.5" 
                stroke="currentColor" 
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </label>
            <input id="upload" type="file" className="hidden" onChange={handleImageChange}/>
          </div>
        </div> */}


        {/* 작성 완료 버튼 */}
        <div className='flex justify-center'>
          <button 
            className="mt-5 bg-transparent hover:bg-gray-500  font-semibold hover:text-white py-2 px-4 border border-black hover:border-transparent rounded"
            onClick={handleReviewSubmit}
          >
            등록하기
          </button>
        </div>
      </div>
    </div>
  )
}

export default PostReview