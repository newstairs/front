'use client'
import { useState } from "react";

const MakeStar = ({ setStarRating }) => {
  const [selectedRating, setSelectedRating] = useState(null);
  const [hoveredRating, setHoveredRating] = useState(null);

  const handleStarHover = (rating) => {
    setHoveredRating(rating);
  };

  const handleStarLeave = () => {
    setHoveredRating(null);
  };

  const handleStarClick = (rating) => {
    setSelectedRating(rating);
    if ( setStarRating ) {
      setStarRating(rating); // 부모 컴포넌트로 별점 값 전달
    }
    console.log('Selected Rating:', rating);
  };

  const renderStar = (index) => {
    const rating = index + 1;
    const isFullFilled = hoveredRating ? hoveredRating >= rating : selectedRating >= rating;

    return (
      <svg
        key={index}
        xmlns="http://www.w3.org/2000/svg"
        fill={isFullFilled ? 'orange' : 'lightgray'}
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke=""
        className="w-8 h-8 flex cursor-pointer"
        onMouseEnter={() => handleStarHover(rating)}
        onMouseLeave={handleStarLeave}
        onClick={() => handleStarClick(rating)}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
    );
  };

  return (
    <div className='text-center py-20'>
      <p>이용하신 마트는 어떠셨나요?</p>
      <p>평점을 남겨주세요</p>
      <div className='flex justify-center items-center'>
        {Array.from({ length: 5 }).map((_, index) => renderStar(index))}
      </div>
    </div>
  );
}

export default MakeStar;