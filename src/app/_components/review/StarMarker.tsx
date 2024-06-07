'use client'
import { useState } from "react";

const MakeStar = () => {
  const [selectedRating, setSelectedRating] = useState(null);

  const handleStarHover = (rating) => {
    setSelectedRating(rating);
  };

  const handleStarClick = (rating) => {
    setSelectedRating(rating);
    console.log('Selected Rating:', rating);
  };

  return (
    <div className='text-center py-20'>
        <p>이용하신 마트는 어떠셨나요?</p>
        <p>평점을 남겨주세요</p>
        <div className='flex justify-center items-center'>
        {[1, 2, 3, 4, 5].map((rating) => (
          <svg xmlns="http://www.w3.org/2000/svg"  fill={(selectedRating && rating <= selectedRating) ? 'orange' : 'lightgray'} viewBox="0 0 24 24" strokeWidth="2" stroke="" className="w-8 h-8 mt-2 flex"
            onMouseEnter={() => handleStarHover(rating)} onClick={() => handleStarClick(rating)}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
          </svg>
        ))}
        </div>
    </div>
  )
}

export default MakeStar;