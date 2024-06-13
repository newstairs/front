interface weather{

  weathers:string
}

interface MapProps{
  weather:weather
}

const WeatherModal: React.FC<MapProps> =({weather})=>{

  const changelocal=()=>{
    const data:any=window.localStorage.getItem("daycheck");
    let local_data=JSON.parse(data)
    console.log("before:",local_data)

    if(!local_data.truth){
      local_data.truth=true;
      console.log("change");
    }
    
    console.log("after:",local_data)
    window.localStorage.setItem("daycheck",JSON.stringify(local_data));
  }

  const deletemodal=()=>{
    const doc=document.getElementById("modal");
    doc.style.display="none";
  }
  console.log("weather:",weather)

  return (
  <div id="modal" className="w-[500px] h-[500px] bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2   rounded-lg shadow-md z-20">
    <button onClick={()=>deletemodal()}>x</button>
    <input type="checkbox" onClick={()=>changelocal()} className="w-[50px] h-[50px] bg-black"></input>  
    {weather.weathers}
  </div>);
}

export default WeatherModal;