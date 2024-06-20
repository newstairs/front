'use client'
import React ,{ useEffect,useState } from 'react';
import { useSearchParams,useRouter } from 'next/navigation'
import ReviewPagnation from "../../_components/review/ReviewPagnation";
import ShowReviewDetail from "../../_components/review/ShowReviewDetail"

interface review{
  reviewId:number,
  reviewContent:string,
  score:number,
  memberName:string,
  memberId:number,
  martId:number
}
interface reviewlist{
  review_list:review[]
}

interface Detail{
    id:number
}
const ReviewDetails: React.FC<Detail> = ({id}) => {
  const [reviews,setReviews]=useState<review[]>([])
  const [show,setshow]=useState(true);
  const [page_number,set_page_number]=useState(32);
  const [current_page,set_current_page]=useState(1);


  const [show_page,set_show_page]=useState(false);

  const [content,set_content]=useState<string>();
  const router = useRouter();

  const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI

  const handledetailpage=(x:boolean)=>{
      set_show_page(x);
  }
  
  const handlepagechange=(x:number)=>{
      set_current_page(x);
  }

     //api에서 변수를 받아서 string꼴의 별점을 반환하는 함수.
    function makestar(score:number){
      const a=document.createElement("a");
      score=Math.floor(score/2);
      let star="";
      for(let i=0;i<5;i++){
          score>i ? star+="★" :star+="☆"
      }
      return star;
    };

    console.log(id);
    console.log(9.9/2)

    useEffect(()=>{
      async function res(id){
        const data=await fetch(`${BACKEND_URI}/reviews/${id}?page=${current_page-1}`,{
          method:"GET",
          headers:{
            "Content-Type":"application/json",
            Authorization:"Bearer "+localStorage.getItem("access_token")
          }
        })
        .then((res)=>{
          console.log("Res:",res);
          return res.json();
        })
        
        if(data.success){
          setshow(true);
          setReviews(data.data.content)
        }
        else{
          setshow(false);
        }
      }
      res(id);
    },[current_page])

  const show_review_page=(contents:string)=>{
      set_show_page(true);

      set_content(contents);
    }
  const handle_page_show=(x:boolean)=>{
    set_show_page(x);
      }

  const handleLinkPostPage = () => {
    router.push(`/reviews?id=${id}`);
  }

  return (
  <div className="w-full max-w-4xl mx-auto bg-white shadow-lg p-6 rounded-lg">
    <button 
      className="mt-5 bg-transparent hover:bg-sky-200 font-semibold hover:text-white py-2 px-4 border border-bg-sky-300 hover:border-transparent rounded"
      onClick={handleLinkPostPage}
    >
      등록하기
    </button>
    {
      // 페이징된 리뷰 데이터를 받아와 나열하는 과정
      show ? reviews.map(x => (
        <li key={x.reviewId} 
            className="flex justify-between items-center p-4 hover:bg-gray-100 rounded-md cursor-pointer transition-colors"
            onClick={() => { show_review_page(x.reviewContent) }}>
          <span className="text-gray-800 text-sm">
            {x.reviewContent}
          </span>
          <span className="text-yellow-500 text-lg">
            {makestar(x.score)}
          </span>
        </li>
      )) :
      <div className="text-center text-gray-500">
        {current_page}
      </div>
    }
    
    {
      // 클릭 시 해당 리뷰 내용을 보여주는 모달창
      show_page && 
      <ShowReviewDetail content={content} setting_show={handle_page_show}/>
    }

    {
      // 페이지네이션 컴포넌트
      <ReviewPagnation set_current_page={handlepagechange} page_number={page_number}/>
    }
  </div>
)
}

export default ReviewDetails;
