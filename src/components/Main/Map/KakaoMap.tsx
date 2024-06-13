'use client'
import React, { useEffect, useState } from 'react'
import { useMap } from './MapProvider'

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
interface GridCoordinates {
  lat: number,
  lng: number,
  x: number,
  y: number,
}

interface coords {
  accuracy:number,
  altitude:number,
  altitudeAccuracy:number,
  heading:number,
  latitude:number,
  longitude:number,
  speed:number
}
interface GeolocationPosition {
  coords: coords,
  timestamp: number,
}

const MapComponent = ({center}) => {
  const kakaoMap = useMap(); // MapProvider에서 제공하는 kakaoMap 객체를 가져옵니다.

  const [map, setMap] = useState(null); // map 상태를 초기화합니다.

  var place_finded = new Map();//polyline 데이터 저장.
  var marker_save_map:Map<string,any> = new Map();//marker랑 place 데이터 저장
  var overlay_save_map:Map<string,any> = new Map();//오버레이 데이터 저장.
  var marker_tracker_map = new Map();//마커트래커 저장.
  var marker_function_save_map:Map<any,any> = new Map();//마커에 등록된 이벤트 지울떄 쓰는 함수.
  const area_mart_name=[];



  // 카카오맵 기능을 위한 함수 모음
  // 중심좌표로 이동하는 버튼 로직
  function panTo () {
    // 이동할 위도 경도 위치를 생성합니다 
    var moveLatLon = new kakaoMap.LatLng(center.lat, center.lng);
    
    // 지도 중심을 부드럽게 이동시킵니다
    // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
    map.panTo(moveLatLon); 
  }

  // 마커 트래킹 관련 함수
  function  MarkerTracker(map: any, target: any) {
    // 클리핑을 위한 outcode
    var OUTCODE = {
      INSIDE: 0, // 0b0000
      TOP: 8, //0b1000
      RIGHT: 2, // 0b0010
      BOTTOM: 4, // 0b0100
      LEFT: 1 // 0b0001
    };

    let BOUNDS_BUFFER = 30;
    let CLIP_BUFFER = 40;

    // trakcer 엘리먼트
    var tracker = document.createElement('div');
    tracker.className = 'tracker';
    // 내부 아이콘
    var icon = document.createElement('div');
      icon.className = 'icon';
    // 외부에 있는 target의 위치에 따라 회전하는 말풍선 모양의 엘리먼트
    var balloon = document.createElement('div');
      balloon.className = 'balloon';

    tracker.appendChild(balloon);
    tracker.appendChild(icon);
      
    map.getNode().appendChild(tracker);

    // traker를 클릭하면 target의 위치를 지도 중심으로 지정합니다.
    tracker.onclick = function() {
      map.setCenter(target.getPosition());
      setVisible(false);
    };

    // target 위치 추적 함수
    function tracking() {
      var proj = map.getProjection();
      // 지도의 영역을 구합니다.
      var bounds = map.getBounds();
      // 지도의 영역을 기준으로 확장된 영역을 구합니다.
      var extBounds = extendBounds(bounds, proj);

      // target이 확장된 영역에 속하는지 판단하고
      if (extBounds.contain(target.getPosition())) {
        // 속하면 tracker를 숨깁니다.
        setVisible(false);
      } else {
        // target이 영역 밖에 있으면 계산을 시작합니다.
        // TooltipMarker의 위치
        var pos = proj.containerPointFromCoords(target.getPosition());
                        
        // 지도 중심의 위치
        var center = proj.containerPointFromCoords(map.getCenter());

        // 현재 보이는 지도의 영역의 남서쪽 화면 좌표
        var sw = proj.containerPointFromCoords(bounds.getSouthWest());
        
        // 현재 보이는 지도의 영역의 북동쪽 화면 좌표
        var ne = proj.containerPointFromCoords(bounds.getNorthEast());

        // 클리핑할 가상의 내부 영역을 만듭니다.
        var top = ne.y + CLIP_BUFFER;
        var right = ne.x - CLIP_BUFFER;
        var bottom = sw.y - CLIP_BUFFER;
        var left = sw.x + CLIP_BUFFER;

        // 계산된 모든 좌표를 클리핑 로직에 넣어 좌표를 얻습니다.
        var clipPosition = getClipPosition(top, right, bottom, left, center, pos);
        
        // 클리핑된 좌표를 tracker의 위치로 사용합니다.
        tracker.style.top = clipPosition.y + 'px';
        tracker.style.left = clipPosition.x + 'px';

        // 말풍선의 회전각을 얻습니다.
        var angle = getAngle(center, pos);

        // 회전각 css로 지정
        balloon.style.cssText +=
            '-ms-transform: rotate(' + angle + 'deg);' +
            '-webkit-transform: rotate(' + angle + 'deg);' +
            'transform: rotate(' + angle + 'deg);';

        // target이 영역 밖에 있을 경우 tracker를 노출합니다.
        setVisible(true);
      }
    }
    function extendBounds(bounds: any, proj: any) {
      // 주어진 bounds는 지도 좌표 정보로 표현 --> 픽셀 단위인 화면 좌표로 변환이 필요.
      var sw = proj.pointFromCoords(bounds.getSouthWest());
      var ne = proj.pointFromCoords(bounds.getNorthEast());
  
      // 확장을 위해 각 좌표에 BOUNDS_BUFFER가 가진 수치만큼 더하거나 빼줍니다.
      sw.x -= BOUNDS_BUFFER;
      sw.y += BOUNDS_BUFFER;
  
      ne.x += BOUNDS_BUFFER;
      ne.y -= BOUNDS_BUFFER;

      // 그리고나서 다시 지도 좌표로 변환한 extBounds를 리턴합니다.
      // extBounds는 기존의 bounds에서 상하좌우 30px만큼 확장된 영역 객체입니다.  
      return new window.kakao.maps.LatLngBounds(
        proj.coordsFromPoint(sw),proj.coordsFromPoint(ne));
    }
    // Cohen–Sutherland clipping algorithm
    // 자세한 내용은 아래 위키에서...
    // https://en.wikipedia.org/wiki/Cohen%E2%80%93Sutherland_algorithm
    function getClipPosition(top:any, right:any, bottom:any, left:any, inner:any, outer:any) {
      function calcOutCode(x: any, y: any) {
        var outcode = OUTCODE.INSIDE;
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
      var ix = inner.x;
      var iy = inner.y;
      var ox = outer.x;
      var oy = outer.y;
  
      var code = calcOutCode(ox, oy);

      while (true) {
        if(!code) {
          break;
        }
        if (code & OUTCODE.TOP) {
          ox = ox + (ix - ox) / (iy - oy) * (top - oy);
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
        code = calcOutCode(ox, oy);
      }
      return {x: ox, y: oy};
    }
    // 말풍선의 회전각을 구하기 위한 함수
    // 말풍선의 anchor가 TooltipMarker가 있는 방향을 바라보도록 회전시킬 각을 구합니다.
    function getAngle(center:any, target:any) {
      var dx = target.x - center.x;
      var dy = center.y - target.y ;
      var deg = Math.atan2( dy , dx ) * 180 / Math.PI; 
      return ((-deg + 360) % 360 | 0) + 90;
    }
    // tracker의 보임/숨김을 지정하는 함수
    function setVisible(visible:any) {
      tracker.style.display = visible ? 'block' : 'none';
    }
    // Map 객체의 'zoom_start' 이벤트 핸들러
    function hideTracker() {
      setVisible(false);
    }
    // target의 추적을 실행합니다.
    this.run = function() {
      window.kakao.maps.event.addListener(map, 'zoom_start', hideTracker);
      window.kakao.maps.event.addListener(map, 'zoom_changed', tracking);
      window.kakao.maps.event.addListener(map, 'center_changed', tracking);
      tracking();
    };
        
    // target의 추적을 중지합니다.
    this.stop = function() {
        window.kakao.maps.event.removeListener(map, 'zoom_start', hideTracker);
        window.kakao.maps.event.removeListener(map, 'zoom_changed', tracking);
        window.kakao.maps.event.removeListener(map, 'center_changed', tracking);
        setVisible(false);
    };
  }

  let place_data: Place_Data;
  var origin_name:string//시작 지점 장소 기억.

  async function convertCoordtToName(x:number, y:number) {
    let opt = {
      method:"GET",
      headers:{
        Authorization:`KakaoAK ${process.env.NEXT_PUBLIC_REST_API_KEY}`
      }
    }
    var data=await fetch(`https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${x}&y=${y}`,opt)
      .then((res)=>{return res.json()}) 

    return data["documents"][0]["road_address"]["address_name"];
  }
  async function geAreaByName(name: string) {
    const opt={
      method:"GET",
      headers:{
          Authorization:`KakaoAK ${process.env.NEXT_PUBLIC_REST_API_KEY}`
      }
    }
    const data=await fetch(`https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(name)}`,opt)
      .then((res)=>{
      return res.json();
    })
    console.log("지역이름:",data);
  }
  async function getByCategory(x: number, y: number) {
    const data=await fetch(`https://dapi.kakao.com/v2/local/search/category.json?category\_group\_code=MT1&x=${x}&y=${y}&radius=1000`,{
      method:"GET",
      headers:{
        Authorization:`KakaoAK ${process.env.NEXT_PUBLIC_REST_API_KEY}`
      }
    })
    //BK9
    .then((res) => {
      return res.json();
    })
    console.log("category:", data);
    return data;
  }


  // 기상청 api 관련 함수
  // 기상청 api가 요구하는 좌표로 변환 함수
  function convertPosition(v1:string, v2:string):GridCoordinates {
    const RE = 6371.00877; // 지구 반경(km)
    const GRID = 5.0; // 격자 간격(km)
    const SLAT1 = 30.0; // 투영 위도1(degree)
    const SLAT2 = 60.0; // 투영 위도2(degree)
    const OLON = 126.0; // 기준점 경도(degree)
    const OLAT = 38.0; // 기준점 위도(degree)
    const XO = 43; // 기준점 X좌표(GRID)
    const YO = 136; // 기1준점 Y좌표(GRID)
    let DEGRAD = Math.PI / 180.0;
    let RADDEG = 180.0 / Math.PI;

    let re = RE / GRID;
    let slat1 = SLAT1 * DEGRAD;
    let slat2 = SLAT2 * DEGRAD;
    let olon = OLON * DEGRAD;
    let olat = OLAT * DEGRAD;

    let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
    let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = re * sf / Math.pow(ro, sn);
    let ra = Math.tan(Math.PI * 0.25 + (parseInt(v1,10) * DEGRAD * 0.5));
    ra = re * sf / Math.pow(ra, sn);
    let theta = parseInt(v2,10) * DEGRAD - olon;
    if (theta > Math.PI) theta -= 2.0 * Math.PI;
    if (theta < -Math.PI) theta += 2.0 * Math.PI;
    theta *= sn;

    const rs: GridCoordinates = {
      lat: parseInt(v1, 10),
      lng: parseInt(v2, 10),
      x: Math.floor(ra * Math.sin(theta) + XO + 0.5),
      y: Math.floor(ro - ra * Math.cos(theta) + YO + 0.5)
    };

    console.log("rs inside:",rs);
    return rs;
  }
  // 기상청 api 정보 조회시 기준 시각 정하는 함수
  function makedate(date: Date):string[] {
    let month=""+(date.getMonth()+1);
    let year=""+date.getFullYear();
    let dt=""+date.getDate();
    const base_time_arr=[2, 5, 8, 11, 14, 17, 20, 23] 
    let hour=date.getHours();
    let hour_now:string|number=hour;
    let min=date.getMinutes();

    if ( 40 >= min ) {
      if ( hour === 0 ) {
        hour_now = "2300";
      }
      else if ( 10 > hour ) {
        hour_now = "0" + (hour - 1).toString() + "00";
      }
      else {
        hour_now = (hour - 1) + "00";
      }
    }
    else {
      if ( 10 > hour ) {
        hour_now = "0" + hour + "00";
      }
      else {
        hour_now = hour + "00";
      }
    }
    console.log("hour_now and hour:", hour_now, hour);

    if( date.getMonth() + 1 < 10 ) {
      month="0"+(date.getMonth()+1)
    }
    if ( date.getDate() < 10 ) {
      dt="0"+date.getDate()
    }
    return [year+month+dt,hour_now]
  }
  // 지역 코드 생성
  function makeAreaCode (name:string) {
    switch (name) {
      case "서울":
      case "인천":
      case "경기도":
        return "109";

      case "부산":
      case "울산":
      case "경남":
        return "159";

      case "대구":
      case "경북":
        return "143";
      
      case "광주":
      case "전남":
        return "156";
          

      case "전북":
        return "146";
          
      case "대전":
      case "세종":
      case "충남":
        return "133";
        
      case "충북":
        return "131";
          
      case "강원도":
        return "105";
    }
  }
  // 지역코드 2글자로 받아오기
  function getstnid(name: string):string {
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
          return "156";
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
  // 현재 시간 관련 함수
  function timeChange(time:number):string {
    let min:number|string=Math.floor(time/60);
    let second:number|string=time-min*60;
    let times="";

    if( min < 10 ) {
      min = "0" + min;
    }
    if ( second < 10 ) {
      second = "0" + second;
    }
    return min + ":" + second;
  }


  // 위치 정보 권한으로 사용자 현위치 불러오기
  // html5에서 위치 정보를 가져오는 함수
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      alert("위치 권한을 허용하거나, 현재 위치를 설정해주십시오.");
    }
  }
  // getLocation 내장 함수(async1 호출)
  function showPosition(position:GeolocationPosition) {
    console.log("showposition: ", position);

    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    origin_cord=["37.654733159968","127.07610170472"]
    console.log("origin+cord:",origin_cord)

    async1()
  }
  // 비동기함수 async1()
  async function async1() {
    console.log("async1");

    async function getmarker(origin_name: string) {
      let servicekey = process.env.NEXT_PUBLIC_serviceKey;
      let date = new Date();

      let datearr = makedate(date);

      // 정보 초기화
      marker_save_map.clear();
      place_finded.clear();
      overlay_save_map.clear();

      for(const x of marker_tracker_map.values()) {
        x.stop();
      }

      marker_tracker_map.clear()
      
      place_data = await getByCategory(Number(origin_cord[1]), Number(origin_cord[0])
    }
  }
  

  // 카카오맵 동작 hook
  useEffect(() => {
    if (kakaoMap && !map) {
      // 지도 설정 및 표시할 div 설정
      const container = document.getElementById('map'); 
      const options = {
        center: new kakaoMap.LatLng(37.566826, 126.9786567),
        level: 3,
      };
      const newMap = new kakaoMap.Map(container, options);
      setMap(newMap);

      
      // 지도가 설정된 이후 컨트롤을 로딩하기
      if (newMap) {
        // 사용자 컨트롤
        const mapTypeControl = new kakaoMap.MapTypeControl();
        // 지도에 컨트롤을 추가
        newMap.addControl(mapTypeControl, kakaoMap.ControlPosition.TOPLEFT);

        // 지도 확대 축소를 제어할 수 있는 줌 컨트롤을 생성
        const zoomControl = new kakaoMap.ZoomControl();
        newMap.addControl(zoomControl, kakaoMap.ControlPosition.LEFT);
      }
      getLocation();
    }
  }, [kakaoMap, map])

  // 현 위치가 변경된 경우 중심좌표를 변경한 장소로 변경하는 로직 
  useEffect(() => {
    if (map && center) {
      const moveLatLon = new kakaoMap.LatLng(center.lat, center.lng);
      map.setCenter(moveLatLon);
    }
  }, [center, map]);

  return (
    <div className="relative w-full max-h-screen">
      <div id="map" className="relative inset-0 w-full h-full"></div>
      <button className="flex justify-center absolute w-[40px] bottom-6 left-4 p-2 bg-white rounded-lg shadow-md z-10" onClick={panTo}>
        <img src='./images/myLocation.png' alt='내 위치' />
      </button>
    </div>
  )
  }



export default MapComponent