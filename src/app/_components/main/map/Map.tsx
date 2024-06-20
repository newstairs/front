'use client'
import React, { useEffect, useState } from 'react'
import { useMap } from './MapProvider'
import '../../../styles/mapmarker.css'
import { text } from 'stream/consumers';
import WeatherModal from './weathermodal';

// interface 정의
interface documentarr {
  address_name:string,
  category_group_code:string,
  category_group_name:string,
  category_name:string,
  distance:string,
  id:string,
  phone:string,
  place_name:string,
  place_url:string,
  road_address_name:string,
  x:string,
  y:string
}
interface meta {
  is_end:boolean,
  pageable_count:number,
  same_name:string,
  total_throw:number
}
interface Place_Data {
  documents: documentarr[],
  meta: meta
}

interface coords {
  accuracy: number,
  altitude: number,
  altitudeAccuracy: number,
  heading: number,
  latitude: number,
  longitude: number,
  speed: number
}
interface geolocationposition {
  coords: coords,
  timestamp: number,
}
interface GridCoordinates {
  lat: number;
  lng: number;
  x: number;
  y: number;
}
interface qa {
  La:number,
  Ma:number
}

const KakaoMapComponent = ({center}) => {
  // kakao map api script kakaoMap 객체 가져오기
  const kakaoMap = useMap();
  const[zoom_func,set_zoom_func]=useState(null);
  // 상태 관리
  const [map, setMap] = useState(null); // map 상태를 초기화합니다.

  const [zoom,setzoom]=useState(true);

  const [function_memmory,set_function_memmorty]=useState(null);

  const [weather_modal,set_weather_modal]=useState(true);

  function wether_modal_truth(){
    set_weather_modal(()=>false)
  }

  const [center_marker,set_center_marker]=useState(null);

  const [marker_save_maps,set_marker_save_map]=useState(null);

  const [over_lay_save_maps,set_overlay_save_maps]=useState(null);

  const [marker_tracker_maps,set_marker_tarcker]=useState(null);

  const [place_findeds,set_place_finded]=useState(null);

  const [marker_function_save_maps,set_marker_function_save_maps]=useState(null);

  //const [over_lay_main_list,set_over_lay_main_list]=useState<any[]>([]);


  const [weather_special,set_weater_special]=useState(null);

  const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

  // 마커 트래킹에 필요한 변수들
  var place_finded=new Map();//polyline 데이터 저장.
  var marker_save_map:Map<string,any>=new Map();//marker랑 place 데이터 저장
  var overlay_save_map:Map<string,any>=new Map();//오버레이 데이터 저장.
  var marker_tracker_map=new Map();//마커트래커 저장.
  var marker_function_save_map:Map<any,any>=new Map();//마커에 등록된 이벤트 지울떄 쓰는 함수.

  var customOverlay_main_list_map=new Map();



  const closeandopen=()=>{
    const btn=document.getElementById("closeopenbtn");
    const x=document.getElementById("weather_bar");
    if(btn.textContent=="close"){
      x.className="flex justify-evenly w-full h-[50px] absolute top-0 bg-slate-100 z-40 hidden";
      btn.textContent="open";
      btn.className="w-[50px] h-[50px] bg-red-100 absolute top-0 right-0 z-50"
    }
    else{
      btn.textContent="close";
      x.className="flex justify-evenly w-full h-[50px] absolute top-0 bg-slate-100 z-40"
      btn.className="w-[50px] h-[50px] bg-red-100 absolute top-[50px] right-0 z-50"
    }
  }


  // 함수 모음 
  // 함수 작동 흐름 (getLocation --> async1(기상청 날씨 api) --> async2(트래커 경로 표시, 마커 오버레이 ) --> makemarker)
  // 트래커 만드는 함수
  function MarkerTracker(map: any, target: any) {
    // 클리핑을 위한 outcode
    const OUTCODE = {
      INSIDE: 0,
      TOP: 8,
      RIGHT: 2,
      BOTTOM: 4,
      LEFT: 1
    }
    const BOUNDS_BUFFER = 30;
    const CLIP_BUFFER = 40;

  // tracker, 내부 icon, 말풍선 element
  let tracker = document.createElement('div');
    tracker.className = 'tracker';
  let icon = document.createElement('div');
    icon.className = 'icon';
  let balloon = document.createElement('div');
    balloon.className = 'balloon';
    tracker.appendChild(balloon);
    tracker.appendChild(icon);
    
    console.log("map:",map);
    map.getNode().appendChild(tracker);

    // tracker 클릭시 target의 위치를 중심좌표로 변경
    tracker.onclick = function() {
      map.setCenter(target.getPosition());
      setVisible(false);
    };

    // target 위치 추적 함수
    function tracking () {
      let proj = map.getProjection();
      let bounds = map.getBounds();
      let extBounds = extendBounds( bounds, proj);
      // target이 확장된 영역에 속하는지 판단
      if(extBounds.contain(target.getPosition())) {
        // 속하면 트래커 숨김
        setVisible(false);
      }
      else {
        // 영역 밖이면 위치 계산 시작
        let pos = proj.containerPointFromCoords(target.getPosition());//TooltipMarker 위치
        let center = proj.containerPointFromCoords(map.getCenter());//지도 중심 위치
        let sw = proj.containerPointFromCoords(bounds.getSouthWest());//현재 보이는 지도의 남서쪽 화면 좌표
        let ne = proj.containerPointFromCoords(bounds.getNorthEast());//현재 보이는 지도의 북동쪽 화면 좌표

        //클리핑할 가상의 내부 영역 만들기
        let top = ne.y + CLIP_BUFFER;
        let right = ne.x - CLIP_BUFFER;
        let bottom = sw.y - CLIP_BUFFER;
        let left = sw.x + CLIP_BUFFER;
        // 계산된 좌표 클리핑 로직에 넣어 좌표 얻어오기
        let clipPosition = getClipPosition(top, right, bottom, left, center, pos);
        //클리핑된 좌표를 tracker의 위치로 사용
        tracker.style.top = clipPosition.y + 'px';
        tracker.style.left = clipPosition.x + 'px';
        //말풍선의 회전각 얻기
        let angle = getAngle(center, pos);

        balloon.style.cssText +=
          '-ms-transform: rotate(' + angle + 'deg);' +
          '-webkit-transform: rotate(' + angle + 'deg);' +
          'transform: rotate(' + angle + 'deg);';
        setVisible(true);
      }
    }
    //bounds 확장 함수
    function extendBounds(bounds: any, proj: any) {
      //주어진 bounds는 지도 좌표 정보 --> 픽셀 단위인 화면 좌표로 변환
      let sw = proj.pointFromCoords(bounds.getSouthWest());
      let ne = proj.pointFromCoords(bounds.getNorthEast());

      sw.x -= BOUNDS_BUFFER;
      sw.y += BOUNDS_BUFFER;
      ne.x += BOUNDS_BUFFER;
      ne.y -= BOUNDS_BUFFER;

      return new kakaoMap.LatLngBounds(
        proj.coordsFromPoint(sw), proj.coordsFromPoint(ne)
      );
    }
    // Cohen-Sutherland clipping algorithm
    function getClipPosition(top: any, right: any, bottom: any, left: any, inner: any, outer: any) {
      function calcOutcode(x: any, y: any) {
        let outcode = OUTCODE.INSIDE;
        if (x < left) {
          outcode |= OUTCODE.LEFT; 
        } else if (x > right) {
          outcode |= OUTCODE.RIGHT;
        }
        if (y < top) {
          outcode |= OUTCODE.TOP;
        } else if (y > bottom) {
          outcode |= OUTCODE.BOTTOM;
        }
        return outcode;
      }
      let ix = inner.x;
      let iy = inner.y;
      let ox = outer.x;
      let oy = outer.y;
      let code = calcOutcode(ox, oy);

      while (true) {
        if (!code) {
          break;
        }
        if (code & OUTCODE.TOP) {
          ox = ox + (ix - ox) / (iy - oy) * (top -oy);
          oy = top;
        } else if (code & OUTCODE.RIGHT) {
          oy = oy + (iy - oy) / (ix - ox) * (right - ox);
          ox = right;
        } else if (code & OUTCODE.BOTTOM) {
          ox = ox + (ix - ox) / (iy - oy) * (bottom - oy);
          oy = bottom;
        } else if (code & OUTCODE.LEFT) {
          oy = oy + (iy - oy) / (ix - ox) * (left - ox);
          ox = left;
        }
        code = calcOutcode(ox, oy);
      }
      return { x: ox, y: oy };
    }
    // 말풍선 회전각 계산 함수
    function getAngle(center: any, target: any) {
      let dx = target.x - center.x;
      let dy = center.y - target.y;
      let deg = Math.atan2(dy, dx) * 180 / Math.PI;

      return ((-deg + 360) % 360 | 0) + 90;
    }
    // 트래커 보임/숨김 지정 함수
    function setVisible(visible: any) {
      tracker.style.display = visible ? 'block' : 'none';
    }
    // Map 객체의 'zoom_start' 이벤트 핸들러
    function hideTracker() {
      setVisible(false);
    }
    // target 추적 시작
    this.run = function() {
      kakaoMap.event.addListener(map, 'zoom_start', hideTracker);
      kakaoMap.event.addListener(map, 'zoom_changed', tracking);
      kakaoMap.event.addListener(map, 'center_changed', tracking);
      tracking();
    }
    // target 추적 중지
    this.stop = function() {
      kakaoMap.event.removeListener(map, 'zoom_start', hideTracker);
      kakaoMap.event.removeListener(map, 'zoom_changed', tracking);
      kakaoMap.event.removeListener(map, 'center_changed', tracking);
      setVisible(false);
    }
  }

  function timechange(time:number) :string{
    var min:number|string=Math.floor(time/60);
    var second:number|string=time-min*60;
    var times="";

    if(min<10){

        min="0"+min;


    }
    if(second<10){
        second="0"+second
    }

    return min+"분"+second+"초";
    
  }

  // 현 위치 정보 기억
  let origin_cord: string[];
  // geolocation을 이용해 현 위치 불러오기
  function getLocation() {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function showPosition(position:geolocationposition) {

        // let locPosition = new kakaoMap.LatLng(latitude, longitude);
        // console.log("center:",center.lat.toString().substring(0),center.lng.toString().substring(0));        
        if(center.lat!==null && center.lng!==null){
            console.log(center.lat.toString().substring(0).length);
            origin_cord=[center.lat.toString().substring(0),center.lng.toString().substring(0)]
            
          }
        else{
          let latitude = position.coords.latitude;
          let longitude = position.coords.longitude;
          origin_cord=[latitude.toString(),longitude.toString()]
          center.lat=latitude;
          center.lng=longitude;
          
        }
        // 지도 중심을 사용자 위치로 이동시킵니다

        let locPosition = new kakaoMap.LatLng(Number(origin_cord[0]), Number(origin_cord[1]));
        map.setCenter(locPosition);
        console.log("현 위치를 성공적으로 불러왔습니다!")

        // origin_cord = [latitude.toString(), longitude.toString()];
        //origin_cord=["37.654733159968","127.07610170472"]
        console.log("origin_cord: ", origin_cord);

        async1();
      });
    }
    else {
      alert("지원하지 않는 브라우저입니다. 메뉴 탭에서 현재 주소를 설정해주세요!");
    }
  }

  let place_data: Place_Data;

  let weather_area_code = {
    "109":"서울,인천,경기",
    "159":"부산,울산,경남",
    "143":"대구,경북",
    "156":"광주,전남",
    "146":"전북",
    "133":"대전,세종,충남",
    "131":"충북",
    "105":"강원"
}
  // 시작 지점 장소 기억
  let origin_name: string;
  // 기상청 날씨정보 api 함수
  async function async1() {
    console.log("async1");
 
    async function getmarker(origin_name: string) {
      let serviceKey = process.env.NEXT_PUBLIC_serviceKey;
      let date = new Date();

      let datearr = makedate(date);
      console.log(datearr);

      marker_save_map.clear();
      place_finded.clear();
      overlay_save_map.clear();

      for(const x of marker_tracker_map.values()) {
        x.stop();
      }
      marker_tracker_map.clear();

      //중간의 clear, stop의 경우 기존에 저장된 마커, polyline, overlay 등 지도에서 표시하는 것을 취소하고 map을 비우기 위함.

      place_data = await getbycategory(Number(origin_cord[1]), Number(origin_cord[0]));
      const mart_data = place_data.documents[0];
      console.log(place_data);
      console.log("mart_around:", mart_data);
      let doc_list=[];
      for(const x of place_data.documents){
        doc_list.push({martName:x.place_name,martAddress:x.road_address_name})
      };
      let answer = await fetch(`${BACKEND_URI}/marts`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer "+localStorage.getItem("access_token")
        },
        body: JSON.stringify(doc_list)
      })
      .then((res) => {return res.json()})
      localStorage.setItem("mart_around", JSON.stringify(answer.data));
      console.log("ans:", answer);
      console.log("place_data: ", place_data);

      let stnId:string="";
      let weatherdata = {};
      let weather_local_data = {};

      let rs = convertposition(origin_cord[0], origin_cord[1]);
      let nx = rs.x;
      let ny = rs.y;
      console.log("nx,nxy:",nx,ny,datearr);
      let url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${serviceKey}&pageNo=1&numOfRows=10&base_date=${datearr[0]}&base_time=${datearr[1]}&dataType=JSON&nx=${nx}&ny=${ny}`

      let option = {
        method: "get"
      }
      let data = await fetch(url, option)
        .then((result)=>{
          return result.json();
        })
      console.log("weather_local_data:",data);
      for (const x of data.response.body.items.item) {
        switch (x.category) {
          case "T1H":
            weather_local_data["T1H"] = x.obsrValue;
            break;
          case "PTY":
            weather_local_data["PTY"]=x.obsrValue;
            break;
          case "RN1":
            weather_local_data["RN1"]=x.obsrValue;
            break;
          case 'VEC':
            weather_local_data["VEC"]=x.obsrValue;
            break;
          default:
            break;
        }
      }
      let fromTmFc = datearr[0];
      let toTmFc = datearr[0];
      let area_name = place_data["documents"][0]["address_name"].substring(0,2);

      stnId = getstnid(area_name);

      data = await fetch (`https://apis.data.go.kr/1360000/WthrWrnInfoService/getWthrWrnList?serviceKey=${serviceKey}&numOfRows=10&pageNo=1&dataType=JSON&fromTmFc=${fromTmFc}&toTmFc=${toTmFc}&stnId=${stnId}`,option)
        .then((res)=>{
          return res.json();
        }
      )
      console.log('기상청 특보데이터:',data);
      try {
        let strs = data.response.body.items.item[0].title;
        let arr = strs.split(" ");
        weatherdata["특보데이터"] = "";
        for (const x of arr) {
          if (x.includes("주의보")) {
            weatherdata["특보데이터"] += x;
          }
        }
      }
      catch (error) {
        weatherdata["특보데이터"] = null;
        console.log("기상 특보가 없음!");
      }
      finally {
        for (var i=0; i < place_data["documents"].length; i++) {
          displayMarker(place_data["documents"][i]);
        }

        set_marker_save_map(()=>marker_save_map);
      }

      if (weatherdata["특보데이터"]  === null) {
        console.log("특보데이터가 없습니다!");
        set_weater_special(()=>null)
      }
      else {
        if(weatherdata["특보데이터"]!==""){
        console.log(weatherdata["특보데이터"]);
        console.log(weather_local_data);
        console.log("현재" + weather_area_code[stnId] + "지역에" + weatherdata["특보데이터"] + "가 발생했습니다.")
        let data={weathers:"현재 " + weather_area_code[stnId] + " 지역에 " + weatherdata["특보데이터"] + "가 발생했습니다."};
        set_weater_special(()=>data)}
        else{
          
        }
      }
      for(const local_data of Object.keys(weather_local_data)) {
        switch (local_data){
          case "PTY":
            console.log("강수유형");
            break;
          case "RN1":
            console.log("강수량:",weather_local_data[local_data]);
            const doc1=document.getElementById(local_data)
            let textNode = document.createElement("span");
            textNode.textContent=(weather_local_data[local_data]+"mm");
            textNode.className="inline";
            if(doc1.children[1]){
              doc1.children[1].remove();
            }
            doc1.appendChild(textNode);
            break;
          case "T1H":
            console.log("현재기온:",weather_local_data[local_data]);
            let textNode2 = document.createElement("span");
            textNode2.textContent=(weather_local_data[local_data]+"°C");
            textNode2.className="inline";
            const doc2=document.getElementById(local_data)
            if(doc2.children[1]){
              doc2.children[1].remove();
            }
            doc2.appendChild(textNode2)
            break;
          case "VEC":
            console.log("풍속:",weather_local_data[local_data]);
            let textNode3= document.createElement("span");
            textNode3.textContent=(weather_local_data[local_data]+"m/s");
            textNode3.className="inline";
            const doc3=document.getElementById(local_data)
            if(doc3.children[1]){
              doc3.children[1].remove();
            }
            doc3.appendChild(textNode3);
            break;
        }
      }
     
      displayCenterMarker(center.lat,center.lng);
      function zoomfunc(){
        console.log("zoom")
        setzoom(zoom=>{
            const newzoom=!zoom;
            map.setZoomable(newzoom);
            if(newzoom!==true){
                zoom_map.textContent="-";
                
                

            }
            else{
                zoom_map.textContent="+"

               

            }

            return newzoom;
        })

      }
      let zoom_map=document.getElementById("map_zoom");
      if(zoom_func===null){
        console.log("event memeory")
        set_zoom_func(()=>zoomfunc);
        
      }
      else{
      
        
        zoom_map.removeEventListener("click",zoom_func);
        
        set_zoom_func(()=>zoomfunc);
      }
      
      zoom_map.addEventListener("click",zoom_func);

      const btn = document.getElementById("showmarker");
      function activeasync2(){
        async2();
        console.log("button")
      }
      if(function_memmory===null){
        console.log("event memeory")
        set_function_memmorty(()=>activeasync2);
      }
      else{
          btn.removeEventListener("click",function_memmory);
         set_function_memmorty(()=>activeasync2);
      }

      btn.addEventListener("click",activeasync2)




      // place_data로 좌표를 불러와 해당 좌표에 마커를 만드는 과정
      function displayMarker (place: any) {
        console.log("displaydata: ", place);
        let marker = new kakaoMap.Marker({
          map: map,
          position: new kakaoMap.LatLng(place.y, place.x),
        })
        marker_save_map.set(place.place_name, [marker,place])
      }
      console.log("geocoder End!");




      function displayCenterMarker(lat:number,lng:number){

        console.log("latlng:",lat,lng);
        var imageSrc = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Me_bank_logo15.png/225px-Me_bank_logo15.png" // 마커이미지의 주소입니다    
        let imageSize = new kakaoMap.Size(64, 69) // 마커이미지의 크기입니다
        let imageOption = {offset: new kakaoMap.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다
        
        var markerImage = new kakaoMap.MarkerImage(imageSrc, imageSize, imageOption)
        var marker = new kakaoMap.Marker({
            map: map,
            position: new kakaoMap.LatLng(lat,lng), 
            image:markerImage

        });
        console.log("markercenter");
        //center_marker_save_map.set("center",marker);

        set_center_marker(()=>marker);
      }
    

    }
    origin_name = await convertcoordtoname(Number(origin_cord[1]),Number(origin_cord[0]));
    getmarker(origin_name);
  }
  // async1 내장함수들
  function makedate(date:Date):string[] {
    var month = "" + (date.getMonth()+1);
    var year = "" + date.getFullYear();
    var dt = "" + date.getDate();
    const base_time_arr = [2, 5, 8, 11, 14, 17, 20, 23];
    var hour = date.getHours();
    var hour_now: string | number = hour;
    var min = date.getMinutes();

    if (40 > min) {
      if(hour === 0) {
        hour_now = "2300";
      }
      else if ( 10 > hour) {
        hour_now = "0" + (hour -1).toString() + "00";
      }
      else {
        hour_now = (hour-1) + "00";
      }
    }
    else {
      if(10 > hour) {
        hour_now = "0" + hour + "00";
      }
      else {
        hour_now = hour + "00";
      }
    }
    console.log("hour_now and hour: ", hour_now, hour);

    if (date.getMonth() + 1 < 10) {
      month = "0"+(date.getMonth() + 1);
    }
    if (date.getDate() < 10) {
      dt = "0" + date.getDate()
    }

    return [year + month + dt, hour_now];

  }
  async function getbycategory (x: number, y: number) {
    console.log(x,y);
    const data = await fetch(`https://dapi.kakao.com/v2/local/search/category.json?category\_group\_code=MT1&x=${x}&y=${y}&radius=1000`, {
      method: "GET",
      headers: {
        Authorization:`KakaoAK ${process.env.NEXT_PUBLIC_REST_API_KEY}`
      }
    })
    .then ((res) => {
      return res.json();
    })
    console.log("category:", data);
    /*for(const x of data){
      area_mart_name.push({martName:x.road_address_name,address:x.place_name});
    }*/
    return data;
  }
  function convertposition(v1:string, v2:string):GridCoordinates{
    var RE = 6371.00877; // 지구 반경(km)
    var GRID = 5.0; // 격자 간격(km)
    var SLAT1 = 30.0; // 투영 위도1(degree)
    var SLAT2 = 60.0; // 투영 위도2(degree)
    var OLON = 126.0; // 기준점 경도(degree)
    var OLAT = 38.0; // 기준점 위도(degree)
    var XO = 43; // 기준점 X좌표(GRID)
    var YO = 136; // 기1준점 Y좌표(GRID)
    var DEGRAD = Math.PI / 180.0;
    var RADDEG = 180.0 / Math.PI;

    var re = RE / GRID;
    var slat1 = SLAT1 * DEGRAD;
    var slat2 = SLAT2 * DEGRAD;
    var olon = OLON * DEGRAD;
    var olat = OLAT * DEGRAD;

    var sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
    var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = re * sf / Math.pow(ro, sn);
    // var rs = {};
    
    //rs['lat'] = parseInt(v1,10);
    //rs['lng'] = parseInt(v2,10);
    var ra = Math.tan(Math.PI * 0.25 + (parseFloat(v1) * DEGRAD * 0.5));
    ra = re * sf / Math.pow(ra, sn);
    var theta = parseFloat(v2) * DEGRAD - olon;
    if (theta > Math.PI) theta -= 2.0 * Math.PI;
    if (theta < -Math.PI) theta += 2.0 * Math.PI;
    theta *= sn;
    //rs['x'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
    //rs['y'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);

    const rs: GridCoordinates = {
        lat: parseFloat(v1),
        lng: parseFloat(v2),
        x: Math.floor(ra * Math.sin(theta) + XO + 0.5),
        y: Math.floor(ro - ra * Math.cos(theta) + YO + 0.5)
    };

    console.log("rs inside:",rs);
    return rs;
  }
  function getstnid(name:string):string {
    switch(name){
      case "서울":
      case "경기":
      case "인천":
        return "109"
      case "부산":
      case "울산":
      case "경남":
        return "159"
      case "대구":
      case "경북":
        return "143";
      case  "광주":
      case "전남":
        return "!56";
      case "전북":
        return "146";
      case "대전":
      case "세종":
      case "충남":
        return "133";
      case "충북":
        return "131";
      case "강원":
        return "105";
      default:
        return "";
    }
  }
  async function convertcoordtoname(x: number, y: number) {
    let opt = {
      method: "GET",
      headers: {
        Authorization:`KakaoAK ${process.env.NEXT_PUBLIC_REST_API_KEY}`
      }
    }
    var data=await fetch(`https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${x}&y=${y}`,opt)
    .then((res)=>{return res.json()})
    try{
    return (
      data["documents"][0]["road_address"]["address_name"]
    );}
    catch(error){console.log("도로명주소가없어요");}
  }

  // async2
  async function async2() {
    console.log("async2");
    console.log("marker_Save_map:",marker_save_map);
    console.log("over_lay_map:",overlay_save_map);
    console.log("marker_funcion_save_map:",marker_function_save_map);
    console.log("marker_trakcer_map",marker_tracker_map);

    for(const key of overlay_save_map.keys()){
      console.log("key test:",key);
      place_finded.get(key).setMap(null);
      overlay_save_map.get(key).setMap(null);
    }

    for(const key of marker_function_save_map.keys()){
      window.kakao.maps.event.removeListener(key,'click',marker_function_save_map.get(key));
    }
    for(const x of marker_tracker_map.values()){
      x.stop();//마커 트레이서기능을 종료시키는 과정.
    }
    marker_tracker_map.clear();
    overlay_save_map.clear();
    place_finded.clear();
    customOverlay_main_list_map.clear();
    marker_function_save_map.clear();
    console.log("마커 함수 저장 제거후 :",marker_function_save_map.keys());
    console.log("오버레이 키값 제거후:",overlay_save_map.keys());
    //여기까지애들은 새로운 장바구니 조건에따라 길찾기 및 마트찾기를 생각해서 overlay과 marker_tracker를 카카오 맵에서 지우고 초기화 하는 과정이다.


    // 호출방식의 URL을 입력합니다. 우선 저의 개인 key를 가져오서 넣었습니다.

    // 출발지(origin), 목적지(destination)의 좌표를 문자열로 변환합니다.
    //맨위에서 사용자가 입력했던 자신의 위치를 말한다.
    /*
    카카오 map api에서 길찾기 에쓰던가 destination은 for문 안에 들어가먄됨.
    const origin = `${origin_cord[1]},${origin_cord[0]}`; 

    const destination=`${pos_data[1].x},${pos_data[1].y}`;
    //위의 origin처럼 마트들의 경도,위도를 담는것.    

    const headers = {
        Authorization: `KakaoAK ${REST_API_KEY}`,
        'Content-Type': 'application/json'
    };


    const queryParams = new URLSearchParams({
        origin: origin,
        destination: destination
    });

    const requestUrl = `${url}?${queryParams}`; // 파라미터까지 포함된 전체 URL*/

    var datafromback=["KB국민은행 상계역지점","IBK기업은행365 중계주공3단지아파트","코리아세븐 세븐-중계2호 ATM"]// 오버레이 마커트레이서 polyline을 테스트하기위해서 넣은애.
    // var datafromback=location["datas"]
    

    //나중에 back에서 데이터를 받아와서넣을때 쓸 헤더임.
    //token의경우 jwt토큰을 의미한다.
    /*const headers2 = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    back에서 데이터 받아오기!----- 위에서 테스트용으로 적어둔 데이터 와같은 마트 데이터들을 받아옴을 의미함.
    즉 우리가 말했던 장바구니를 만족하는 마트들의 데이터를 말한다.
    const datafromback2=await fetch(request,{
      method:'POST',
      headers:headers2,
      body: JSON.stringify({
      data_around:[]})
    }).json();*/

    datafromback=JSON.parse(localStorage.getItem("mart_around"));
    console.log("datafromback:",datafromback);

    let mart_price_all_data = await fetch(`${BACKEND_URI}/marts/selling`, {
      method: "GET",
      headers: {
        Authorization:"Bearer "+localStorage.getItem("access_token")
      }
    })
    .then ((res) => {
      return res.json();
    })
   //over_lay_main_list=[];
    for(const position of datafromback) {
      console.log("position:",position["martName"]);
      var pos_data=marker_save_map.get(position["martName"]);
      console.log("pos_data:",pos_data);

      try {
        const options = {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'appKey': process.env.NEXT_PUBLIC_sk_api_key
          },
          body: JSON.stringify({
            startX: origin_cord[1],
            startY: origin_cord[0],
            speed: 20,
            endX: pos_data[1].x,
            endY: pos_data[1].y,
            startName: encodeURI(origin_name),
            endName: encodeURI(position),
            sort: 'index',
            searchOption: "10"
          })
        }
        var data=await fetch("https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&callback=function",options)
        .then((result)=>{
        return result.json();
        })
        var linepath:qa[]=[];
        var testroute=data.features;
        console.log("roudtedata:",testroute);
        testroute.forEach((router:any,index:number)=>{
          console.log(router,index);
          if((router.geometry ?? {}).type==="LineString"){
            router.geometry.coordinates.forEach((vertex:number[],idx:number)=>{
              linepath.push(new window.kakao.maps.LatLng(vertex[1],vertex[0]))
            })
          }
        });
        //한 목적지에서 우리의 위치까지의 경로들을 linepath에다가 담는과정.
        console.log("pods_data:",pos_data);
        console.log("linepath:",linepath);

        console.log("mart_price_all_data:",mart_price_all_data);
        //mart_price_all_data=mart_price_all_data.data;
        console.log("mart_price_all_data:",mart_price_all_data);
        console.log("position:",position);
        await makemarker(pos_data,linepath,position["martId"],mart_price_all_data)
        console.log("hello")
      }
      catch(error) {
        console.error('Error:', error);
      }
    }

    console.log("why")
    set_overlay_save_maps(()=>overlay_save_map);
    set_place_finded(()=>place_finded);
    set_marker_function_save_maps(()=>marker_function_save_map);
    set_marker_tarcker(()=>marker_tracker_map);
    for(const x of customOverlay_main_list_map.keys()){
      let ars= Array.from(customOverlay_main_list_map.keys());
      x.addEventListener("click",(event)=>{
        
        ars.map((item)=>{
        
          if(item===x){
            customOverlay_main_list_map.get(item).setZIndex(10);
            console.log( customOverlay_main_list_map.get(item).getZIndex())
          }
          else{
            customOverlay_main_list_map.get(item).setZIndex(3);
            console.log( customOverlay_main_list_map.get(item).getZIndex())
          }
        })

      


      })
    }
  }
  // async2 내장함수
  async function makemarker (pos_data:any,linepath:any,martid:number,mart_price_all_data:any) {
    //마트 이름
    pos_data[1].place_name;

    let hexcolorcode = '#';
    console.log("martid:",martid);
    for(let i=0;i<1;i++){
      hexcolorcode+=Math.floor(Math.random() * (256 -1) +1).toString(16);
    }
    hexcolorcode+="0000";
    //같은 색이면 구분안되니까 polyline에들어갈 색들을 랜덤하게 만드는 과정.

    var polyline = new window.kakao.maps.Polyline({
      map: map,
      path:linepath,
      strokeWeight: 2,
      strokeColor: hexcolorcode,
      strokeOpacity: 1,
      strokeStyle: 'line'
    });//polyline즉 맵에 경로가 표시되는것들의 설정.

    console.log(polyline.getLength());//목적지에서 내위치까지의 거리를 알려줌.

    //디자인이 가능하다
    const over_lay_main=document.createElement("div");
    //const over_lay_serve=document.createElement("div");
    const over_lay_star=document.createElement("div");
    const over_lay_cart_list=document.createElement("div")
    const over_lay_cart_list_btn=document.createElement("button");

    over_lay_main.className = "bg-white rounded-lg shadow-lg p-4 w-[200px] h-[250px] relative";
    //over_lay_serve.className = "bg-red-100 rounded-t-lg w-full h-[150px] mb-2";
    over_lay_cart_list_btn.className = "bg-blue-500 text-white rounded-full w-[40px] h-[40px] absolute right-2 bottom-2";
    over_lay_cart_list.className = "bg-amber-400 rounded-lg shadow-lg w-[250px] h-[250px] p-2 absolute bottom-[60px] left-[-20px] z-30 overflow-auto hidden";
    over_lay_star.className = "flex justify-center items-center bg-slate-500 text-white rounded-b-lg w-full h-[40px] absolute bottom-0 left-0"; 
    over_lay_cart_list_btn.innerText = "자세히";
    
    over_lay_cart_list_btn.addEventListener("click",async ()=> {
      if(over_lay_cart_list.style.display==="none") {
        over_lay_cart_list.style.display="block";
        if(over_lay_cart_list.children.length===0) {
          console.log("line=0");

          const data=await fetch(`${BACKEND_URI}/marts/selling/${martid}`, {
            method:'GET',
            headers:{
                Authorization:"Bearer "+localStorage.getItem("access_token")
            }
          })
          .then((res)=>{
            return res.json();
          })
          console.log("cartdata:",data.data);
          if(data.success){
            for(const x of data.data){
                let lists=document.createElement("li");
                lists.textContent=x.productName+" "+x.finalPrice; 
                lists.className="text-wrap";
                over_lay_cart_list.appendChild(lists);
            }
           //over_lay_serve.textContent+=(mart_price_all_data[martid]+"원");
          }
          else{
            //over_lay_serve.textContent="없음";
            let lists=document.createElement("li");
            lists.className="text-wrap"
            lists.textContent="오류가 발생했습니다. 다시시도해주세요"
            over_lay_cart_list.appendChild(lists);
          }
        }
        else {
        }
        over_lay_cart_list_btn.innerText="닫기";
      }
      else{
        over_lay_cart_list.style.display="none";
                        
        if(over_lay_cart_list.children.length>0){
            let childs=Array.from(over_lay_cart_list.children);

            for(const x of childs){
                x.remove();
            }
        }
        over_lay_cart_list_btn.innerText="자세히";
      }
    })

    function makestar(score: number) {
      const a = document.createElement("a");
      score=Math.floor(score);
      let star="";
      for(let i=0;i<5;i++){
          score>i ? star+="★" :star+="☆"
      }
      a.textContent=star;
      a.style.color="red";
      a.target="_blank";
      let m="https://ssagemeogja.netlify.app/reviews/deatil/35";
      console.log("test:","http://localhost:3000/detail/35".substring(30,m.length))
      a.href=`https://ssagemeogja.netlify.app/reviews/detail/${martid}`;
      over_lay_star.appendChild(a);
    }
    makestar(4.5);

    console.log("martId:",martid);
    /*const mart_product_list=await fetch(`http://localhost:3000/marts/selling/${martid}`,{
      method:"GET",
      headers:{
          Authorization:"Bearer "+localStorage.getItem("access_token")
      }
    }).then((res)=>{return res.json();})
    console.log("mart_product_list:",mart_product_list);
    for(let x of mart_product_list.data){
      let divs=document.createElement("div");
      divs.textContent=x.productName+x.price;
      over_lay_cart_list.appendChild(divs);
    }*/

    //over_lay_main.appendChild(over_lay_serve);

    over_lay_main.appendChild(over_lay_star);
    over_lay_main.appendChild(over_lay_cart_list_btn);
    over_lay_main.appendChild(over_lay_cart_list);

    var customOverlay = new window.kakao.maps.CustomOverlay({
      map: map,
      clickable: true,
      content: over_lay_main,
      position: new window.kakao.maps.LatLng(pos_data[1].y,pos_data[1].x),
      range: 500,
      xAnchor: 1,
      yAnchor: 1,
      zIndex: 3
    });

    //애내둘은 아까 marker_Save_map에다가 저장해둔 마커객체,장소 데이터들을 의미한다.
    var marker=pos_data[0];
    var placename=pos_data[1].place_name;  

    console.log("placename check:",placename);

    let walk_length=document.createElement("li");
    walk_length.textContent="거리:"+Math.round(polyline.getLength()).toString()+"m";

    let place_name_li=document.createElement("li");
    place_name_li.className="text-wrap"
    place_name_li.textContent=placename;

    let time=document.createElement("li");


    let consume_time=Math.round(polyline.getLength()/1.3);
    
    time.textContent="소요 시간:"+timechange(consume_time);

    let total_price=document.createElement("li");
   
    console.log("check value:",mart_price_all_data.data[martid],martid)
    let p=mart_price_all_data.data[martid]!==undefined ? mart_price_all_data.data[martid].toString()+"원":"0원";
    total_price.textContent="합계:"+p


    over_lay_main.appendChild(place_name_li);
    over_lay_main.appendChild(total_price);
    over_lay_main.appendChild(walk_length);
    over_lay_main.appendChild(time);


    
    overlay_save_map.set(placename,customOverlay);
    place_finded.set(placename,polyline);
    //오버레이,poyline들을 map에다가 장소명을 기준으로 저장.

    console.log("placename out:",placename);
    var markertracer=new MarkerTracker(map,marker);
    marker_tracker_map.set(placename,markertracer);
    markertracer.run();//마커트레이서 작동.

    const func = (function(placename) {
      return function() {
        console.log("click!!!");
        if (overlay_save_map.get(placename).getMap() === null) {
          overlay_save_map.get(placename).setMap(map);
         // place_finded.get(placename).setMap(map);
          marker_tracker_map.get(placename).run();
        }
        else {
          overlay_save_map.get(placename).setMap(null);
          //place_finded.get(placename).setMap(null);
          marker_tracker_map.get(placename).stop();
        }
      };
    })(placename);
    // 클릭 이벤트 핸들러를 등록하고, 함수를 marker_function_save_map에 저장합니다.
    window.kakao.maps.event.addListener(marker, 'click', func);
    marker_function_save_map.set(marker, func);
    //console.log("over_lay_main_list:",[...over_lay_main_list,over_lay_main])
    //set_over_lay_main_list(()=>[...over_lay_main_list,over_lay_main])
    customOverlay_main_list_map.set(over_lay_main,customOverlay);
  }

  // panTo 함수(중심좌표로 이동하는 함수)
  function panTo () {
    // 이동할 위도 경도 위치를 생성합니다 
    var moveLatLon = new kakaoMap.LatLng(center.lat, center.lng);
    // 지도 중심을 부드럽게 이동시킵니다
    // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
    map.panTo(moveLatLon); 
  }
  function reset_maps(){

    if(over_lay_save_maps!==null){
      for(const key of over_lay_save_maps.keys()){
        console.log("key test:",key);
        place_findeds.get(key).setMap(null);
        over_lay_save_maps.get(key).setMap(null);
      }
  }
    if(marker_function_save_maps!==null){
      for(const key of marker_function_save_maps.keys()){
        window.kakao.maps.event.removeListener(key,'click',marker_function_save_maps.get(key));
      }
    }
    if(marker_tracker_maps!==null){
      for(const x of marker_tracker_maps.values()){
        x.stop();//마커 트레이서기능을 종료시키는 과정.
      }
    }
    if(marker_save_maps!==null){
      for(const x of marker_save_maps.values()){
        x[0].setMap(null);
      }
    }
    if(center_marker!==null){
      center_marker.setMap(null);
    }

  }
  function weather_modal_check(){
    if(JSON.parse(window.localStorage.getItem("daycheck"))){
      let daycheck=JSON.parse(window.localStorage.getItem("daycheck"));
      let today=new Date().getTime();

      today>daycheck ? set_weather_modal(()=>true) : set_weather_modal(()=>false); 

    }
  }
  // 카카오맵 load hook
  useEffect(()=>{
    console.log("useeffect");
    //set_over_lay_main_list(()=>[])
    weather_modal_check()
   
    if (kakaoMap && !map) {
      // 지도 설정 및 표시할 div 설정
      const container = document.getElementById('map'); 
      const options = {
        center: new kakaoMap.LatLng(37.566826, 126.9786567),
        level: 3,
      };
      const newMap = new kakaoMap.Map(container, options);
      setMap(()=>newMap);


      
    }
    reset_maps();

    if(map) {
      const geocoder = new kakaoMap.services.Geocoder();
    }
    if(kakaoMap && map) {
      getLocation();
    }
  }, [kakaoMap,map,center]);

  // 현 위치가 변경된 경우 중심좌표를 변경한 장소로 변경하는 로직 
  /*useEffect(() => {
    if (map && center) {
      const moveLatLon = new kakaoMap.LatLng(center.lat, center.lng);
      map.setCenter(moveLatLon);
    }
  }, [center, map]);*/

  // 표시하기 버튼 클릭시 async2 함수 실행(마커 오버레이 보여주기)
  /*useEffect(() => {
    const btn = document.getElementById("showmarker");
      function activeasync2(){
        async2();
        console.log("button")
      }
    if(function_memmory===null){
        console.log("event memeory")
        set_function_memmorty(()=>activeasync2);
           
    }
    else{
            
      btn.removeEventListener("click",function_memmory);
      set_function_memmorty(()=>activeasync2);
    }

    btn.addEventListener("click",activeasync2)
    const area_mart_name = [];

    if (btn) {
      btn.addEventListener("click", async2);
    }
    return () => {
      if (btn) {
        btn.removeEventListener("click", async2);
      }
    };
  }, []);*/

  // html
  return (
    <div className="relative w-full h-screen-50">

    { weather_modal ? <WeatherModal weather={weather_special} weather_function={wether_modal_truth}/> :null }



      {/* 날씨 정보 탭 */}
      <div id="weather_bar" className=" flex justify-evenly w-full h-[50px] absolute top-0 bg-slate-100 z-40">
        <div id="T1H" className='flex justify-center items-center'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="w-12 h-12">
          <path fill="#000000" d="M160 64c-26.5 0-48 21.5-48 48V276.5c0 17.3-7.1 31.9-15.3 42.5C86.2 332.6 80 349.5 80 368c0 44.2 35.8 80 80 80s80-35.8 80-80c0-18.5-6.2-35.4-16.7-48.9c-8.2-10.6-15.3-25.2-15.3-42.5V112c0-26.5-21.5-48-48-48zM48 112C48 50.2 98.1 0 160 0s112 50.1 112 112V276.5c0 .1 .1 .3 .2 .6c.2 .6 .8 1.6 1.7 2.8c18.9 24.4 30.1 55 30.1 88.1c0 79.5-64.5 144-144 144S16 447.5 16 368c0-33.2 11.2-63.8 30.1-88.1c.9-1.2 1.5-2.2 1.7-2.8c.1-.3 .2-.5 .2-.6V112zM208 368c0 26.5-21.5 48-48 48s-48-21.5-48-48c0-20.9 13.4-38.7 32-45.3V144c0-8.8 7.2-16 16-16s16 7.2 16 16V322.7c18.6 6.6 32 24.4 32 45.3z"/></svg>
        </div>
        <div id="VEC" className='flex justify-center items-center'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-12 h-12">
          <path fill="#74C0FC" d="M288 32c0 17.7 14.3 32 32 32h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H352c53 0 96-43 96-96s-43-96-96-96H320c-17.7 0-32 14.3-32 32zm64 352c0 17.7 14.3 32 32 32h32c53 0 96-43 96-96s-43-96-96-96H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H384c-17.7 0-32 14.3-32 32zM128 512h32c53 0 96-43 96-96s-43-96-96-96H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H160c17.7 0 32 14.3 32 32s-14.3 32-32 32H128c-17.7 0-32 14.3-32 32s14.3 32 32 32z"/></svg>
        </div>
        <div id="RN1" className='flex justify-center items-center'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-12 h-12"><path fill="#74C0FC" d="M192 512C86 512 0 426 0 320C0 228.8 130.2 57.7 166.6 11.7C172.6 4.2 181.5 0 191.1 0h1.8c9.6 0 18.5 4.2 24.5 11.7C253.8 57.7 384 228.8 384 320c0 106-86 192-192 192zM96 336c0-8.8-7.2-16-16-16s-16 7.2-16 16c0 61.9 50.1 112 112 112c8.8 0 16-7.2 16-16s-7.2-16-16-16c-44.2 0-80-35.8-80-80z"/></svg>
        </div>
      </div>
      <button id="closeopenbtn" className="w-[50px] h-[50px] bg-red-100 absolute top-[50px] right-0 z-30"onClick={()=>{closeandopen()}}>close</button>

      {/* Kakao Map */}
      <div id="map" className="relative inset-0 w-full h-full"></div>

      {/* 중심좌표 이동 함수 */}
      <button
        onClick={panTo}
        className="flex justify-center absolute w-[40px]h-[40px] bottom-6 left-4 p-2 bg-white rounded-lg shadow-md z-10"
      >
        <img src="/utils/myLocation.png" width={15} height={40} />
      </button>

      {/* 마커 표시 하기 버튼 */}
      <button
        id="showmarker"

        className="flex justify-center absolute w-[40px] h-[40px] bottom-6 left-20 p-2 bg-white rounded-lg shadow-md z-10 text-[10px]"
      >
          오버레이

      </button>

      {/* 줌 on/off 버튼 */}
      <button 
        id="map_zoom" 

        className="flex justify-center absolute w-[40px] h-[40px] bottom-6 left-[150px] p-2 bg-white rounded-lg shadow-md z-10"

      >
        +
      </button>
    </div>
  )
}

export default KakaoMapComponent