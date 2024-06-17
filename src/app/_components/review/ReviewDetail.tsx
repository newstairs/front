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
        const data=await fetch(`http://localhost:3000/reviews/${id}?page=${current_page-1}`,{
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
  return (
    <div className="w-[200px] h-[200px] bg-red-100">
        {//페이징 된 리뷰데이틀 받아와서 나열하는 과정
        //나열 될 내용은 마트이름 별점 으로 우선 정해놓음.
        // 아래의 li에 대해서 디자인을 해주면될듯.
        //show 값이 true면 나열하고 아니라면 그냥 현재페이지를 표시하는 숫자를 넣는다
        //원하실대로 show값이 false 즉 아무 페이지도 없을때를 만드셔도 된다.
          show ? reviews.map(x=>(
            <li key={x.reviewId}  onClick={()=>{show_review_page(x.reviewContent)}}className="w-[200px] h-[50px]">
                x.reviewContent+{makestar(x.score)}

    
            </li>

          )):
          <div>{current_page}</div>
        }
      
        {

          //li 태그에서클릭시 해당되는 글의 내용을 보여주는 모달창.
          show_page ? <ShowReviewDetail content={content} setting_show={handle_page_show}/> :<div></div>
        }
      

      {//애같은경우에는 게시판 에서보면 아래의 번호로 다음 번호대의 게시물들을 보여주는것.
      <ReviewPagnation set_current_page={handlepagechange} page_number={page_number}/>}
    </div>
  )
}
            

export default ReviewDetails;
