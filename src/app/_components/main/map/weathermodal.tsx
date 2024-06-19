
interface weather{

    weathers:string
}

interface MapProps{
    weather:weather
    weather_function:()=>void;
}

const WeatherModal: React.FC<MapProps> =({weather,weather_function})=>{
    
    const changelocal=()=>{

        let today=new Date().getTime();
        window.localStorage.setItem("daycheck",JSON.stringify(today+86400000));
        

        weather_function();
        
    }

    const deletemodal=()=>{
        const doc=document.getElementById("modal");
        doc.style.display="none";
        
    }
    console.log("weather:",weather)

    return (<div id="modal" className="w-[250px] h-[250px] absolute bg-blue-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2   rounded-lg shadow-md z-20">
       
        <div className="flex absolute bottom-0 items-center ">
        <input type="checkbox"  onClick={()=>changelocal()} className="w-[20px] h-[20px] bg-black"></input>
        <div className="text-center  inline">하루동안 안보기</div>
        </div>
        <div className=" w-full h-[100px] absolute  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center align-middle">
        {weather !== null ? (
            <>
            {weather.weathers}<br />
            상세 날씨를 꼭 확인해주세요!
            </>
            ) : "평소와 다름없는 날씨내요 좋은 하루되세요!"}
         
        </div>
    </div>);


}

export default WeatherModal;

