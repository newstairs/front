'use client'
import React ,{ useEffect,useState } from 'react';


interface props{
  set_current_page: (page: number) => void,
  page_number:number
}
const ReviewPagnation: React.FC<props>=({set_current_page,page_number})=>{
    const [prev_num,set_prev_num]=useState(1);
    const [next_num,set_next_num]=useState(10); 
  
    
    
    
    //애는 아래의 next_Btn,prev_Btn사이에 들어가는 버튼의 스타일을 정하는 값.
    //prev,show,useeffect로 생성하는 버튼에 들어가는 styles로
    //이걸로 버튼 생김새를 조절하면된다.
    const styles="flex page_btn w-[15px] h-[20px]  mx-[1px] rounded-lg justify-items-center justify-center";
    

    let next_btn=document.getElementById("next_btn");
    let prev_btn=document.getElementById("prev_btn");
    
    
    //애는 다음페이지,이전페이지를 보여주는 버튼의 활성화여부와 그에따른 색깔을 바꿔주는 함수.
    const btn_disabled_setting=(id:string,ans:boolean)=>{
      const next_btn = document.getElementById(id) as HTMLButtonElement;
      const prev_btn = document.getElementById(id) as HTMLButtonElement;
      if(id==="next_btn"){
        next_btn.disabled=ans
        if(ans){
          next_btn.style.color="gray"
        }
        else{
          next_btn.style.color="black";
        }
      }
      else{
        prev_btn.disabled=ans
        if(ans){
          prev_btn.style.color="gray"
        }
        else{
          prev_btn.style.color="black";
        }
      }
    }
    
    const show_previous=()=>{
        let div=document.getElementById("page_area");
        let prev_btn=document.getElementById("prev_btn"); 
        let next_btn=document.getElementById("next_btn");
        let btns=[];
        if(prev_num>=11){
            set_prev_num(prev_num-10)
            set_next_num(next_num-10)
            for(const x of Array.from(div.children)){
              console.log(x);
              x.remove();
            }
            
            for(let x=prev_num-10;next_num-10>=x;x++){
              let btn=document.createElement("button");
              btn.textContent=x.toString();
              div.appendChild(btn);
              btn.className=styles;
              btns.push(btn)
           
            }
            for(const x of btns){
                x.addEventListener("click",()=>{
                    console.log("click in btn");
                  console.log("target:",x.textContent);
                  btns.map((item)=>{
                      if(item.textContent===x.textContent){
                          x.style.color="red";
                          
                          console.log("color:",x.style.color);
                          set_current_page(Number(x.textContent));
                      
                      }
                      else{
                          item.style.color="black";
                      }
                })
                })
            }





            if(prev_num-10===1){
              btn_disabled_setting("prev_btn",true);
           
          
            }
            else{
              btn_disabled_setting("prev_btn",false);
        
            }
            btn_disabled_setting("next_btn",false);
          
        }
          
      }
  
    const show_next=()=>{
          set_prev_num(prev_num+10);
          set_next_num(next_num+10)
          console.log("next_num:",next_num);
          let div=document.getElementById("page_area");
          let next_btn=document.getElementById("next_btn");
          let prev_btn=document.getElementById("prev_btn");
          let btns=[];
          if(next_num+10>page_number){
            for(const x of Array.from(div.children)){
              console.log(x);
              x.remove();
            }
            for(let x=prev_num+10;page_number>=x;x++){
              let btn=document.createElement("button");
              btn.textContent=x.toString();
              div.appendChild(btn);
              btn.className=styles;
              btns.push(btn);
  
  
            }
            console.log("btns:",btns);
            for(const x of btns){
              x.addEventListener("click",()=>{
                console.log("click in btn");
                console.log("target:",x.textContent);
                btns.map((item)=>{
                    if(item.textContent===x.textContent){
                        x.style.color="red";
                        console.log("color:",x.style.color);
                        set_current_page(Number(x.textContent));
                    }
                    else{
                        item.style.color="black";
                    }
              })
              })
            }
       
            btn_disabled_setting("next_btn",true);
            btn_disabled_setting("prev_btn",false);  
             
          }
          
          
          else{
  
              for(const x of Array.from(div.children)){
                console.log(x);
                x.remove();
              }
              for(let x=prev_num+10;next_num+10>=x;x++){
                let btn=document.createElement("button");
                btn.textContent=x.toString();
                div.appendChild(btn);
                btn.className=styles;
                btns.push(btn);
              
              }
              console.log("btns:",btns);
              for(const x of btns){
                x.addEventListener("click",()=>{
                  console.log("click in btn");
                  btns.map((item)=>{
                    if(item.textContent===x.textContent){
                        x.style.color="red";
                        console.log("color:",x.style.color);
                     
                        set_current_page(Number(x.textContent));
                    }
                    else{
                        item.style.color="black";
                    }
                })
                   
                })
              }
 
              if(next_num+10===page_number){
                
             
                btn_disabled_setting("next_btn",true);
               
                
              }
              else{
                btn_disabled_setting("next_btn",false);
           
              }

              btn_disabled_setting("prev_btn",false)
  
          }
  
          
      }
  
    useEffect(()=>{
        let div=document.getElementById("page_area");
        let prev_btn=document.getElementById("prev_btn");
        let next_btn=document.getElementById("next_btn")
        let btns=[];
        if (10>=page_number){
            
          for(let x=1;page_number>=x;x++){
            let btn=document.createElement("button");
            btn.textContent=x.toString();
            btn.className=styles;
            btns.push(btn);
            div.appendChild(btn);
            btn_disabled_setting("next_btn",true);
            btn_disabled_setting("prev_btn",true);
          }
          for(let x of btns){
            x.addEventListener("click",()=>{
              btns.map((item)=>{
                if(item.textContent===x.textContent){
                  x.style.color="red";
                  set_current_page(Number(x.textContent));
                  return true;
                }
                else{
                  item.style.color="black"
                }
              })
            })
          }
        }
        else{
          for(let x=1;10>=x;x++){
            let btn=document.createElement("button");
            btn.textContent=x.toString();
            div.appendChild(btn);
            btn.className=styles;
            btns.push(btn);
            }
            prev_btn.style.color="gray";
          for(let x of btns){
          x.addEventListener("click",()=>{
          btns.map((item)=>{
            if(item.textContent===x.textContent){
              x.style.color="red";
              set_current_page(Number(x.textContent));
             
            }
            else{
              item.style.color="black"
            }
          })
          })
          }
        } 
    },[])


    //배경이나 위치같은 것들은 재량껏맡아서 조정 해주시면될것같다.
    return(
        <div className="flex justify-evenly">
            <button id="prev_btn"  onClick={()=>{show_previous()}}>이전</button>
            <div id="page_area" className="flex justify-center"></div>
            <button id="next_btn" onClick={()=>{show_next()}}>다음</button>
        </div>
    )
}


export default ReviewPagnation;
