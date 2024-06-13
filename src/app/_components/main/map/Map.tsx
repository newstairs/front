'use client';
import React, { useEffect, useRef ,useState} from 'react';
import '../../../styles/mapmarker.css'
import { text } from 'stream/consumers';


interface Location {
  lat: number,
  lng: number
}


interface qa{
    La:number,
    Ma:number
}


interface coords{
    accuracy:number,
    altitude:number,
    altitudeAccuracy:number,
    heading:number,
    latitude:number,
    longitude:number,
    speed:number
}


interface geolocationposition{
    coords:coords,
    timestamp:number
}


interface meta {
    is_end:boolean,
    pageable_count:number,
    same_name:string,
    total_throw:number

}


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


interface Place_Data{
    documents:documentarr[]
    meta:meta
}


interface Location {
  datas:string []
}


interface MapProps {
  location: Location;
}
interface GridCoordinates {
    lat: number;
    lng: number;
    x: number;
    y: number;
  }

  interface router{
    geometry:{type:string,coordinates:number[][]},
    properties:any,    
    type:string
  }


const KakaoMap: React.FC<MapProps> = ({ location }) => {
  const kakao_map_api_key = process.env.NEXT_PUBLIC_JS_KEY;
  // @ts-ignore
  const mapRef = useRef<kakao.maps.Map | null>(null);

  var place_finded=new Map();//polyline 데이터 저장.
  var marker_save_map:Map<string,any>=new Map();//marker랑 place 데이터 저장
  var overlay_save_map:Map<string,any>=new Map();//오버레이 데이터 저장.
  var marker_tracker_map:Map<>=new Map();//마커트래커 저장.
  var marker_function_save_map:Map<any,any>=new Map();//마커에 등록된 이벤트 지울떄 쓰는 함수.
  const [zoom,setzoom]=useState(true);
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

  const area_mart_name=[];
  useEffect(() => {
    
    // Kakao Maps 스크립트 동적 로드
    const script = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakao_map_api_key}&libraries=services,clusterer,drawing`//`https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${kakao_map_api_key}`;
    document.head.appendChild(script);
    script.type="text/javascript";
    // 스크립트 로드 완료 후 지도 생성
    script.onload = () => {

      if (typeof window.kakao !== 'undefined') {
        window.kakao.maps.load(() => {
            //애는 트레커 만드느 함수인대... 읽어보고싶다면 읽어보시길 그냥 run,stop만 쓸줄알면된다.
            function MarkerTracker(map:any, target:any) {
            // 클리핑을 위한 outcode
            var OUTCODE = {
              INSIDE: 0, // 0b0000
              TOP: 8, //0b1000
              RIGHT: 2, // 0b0010
              BOTTOM: 4, // 0b0100
              LEFT: 1 // 0b0001
            };
                
            // viewport 영역을 구하기 위한 buffer값
            // target의 크기가 60x60 이므로 
            // 여기서는 지도 bounds에서 상하좌우 30px의 여분을 가진 bounds를 구하기 위해 사용합니다.
            var BOUNDS_BUFFER = 30;
                
            // 클리핑 알고리즘으로 tracker의 좌표를 구하기 위한 buffer값
            // 지도 bounds를 기준으로 상하좌우 buffer값 만큼 축소한 내부 사각형을 구하게 됩니다.
            // 그리고 그 사각형으로 target위치와 지도 중심 사이의 선을 클리핑 합니다.
            // 여기서는 tracker의 크기를 고려하여 40px로 잡습니다.
            var CLIP_BUFFER = 40;
                
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
                
            // target의 위치를 추적하는 함수
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
                        
                
                        // 지도 bounds를 기준으로 클리핑할 top, right, bottom, left를 재계산합니다.
                        //
                        //  +-------------------------+
                        //  | Map Bounds              |
                        //  |   +-----------------+   |
                        //  |   | Clipping Rect   |   |
                        //  |   |                 |   |
                        //  |   |        *       (A)  |     A
                        //  |   |                 |   |
                        //  |   |                 |   |
                        //  |   +----(B)---------(C)  |
                        //  |                         |
                        //  +-------------------------+
                        //
                        //        B
                        //
                        //                                       C
                        // * 은 지도의 중심,
                        // A, B, C가 TooltipMarker의 위치,
                        // (A), (B), (C)는 각 TooltipMarker에 대응하는 tracker입니다.
                        // 지도 중심과 각 TooltipMarker를 연결하는 선분이 있다고 가정할 때,
                        // 그 선분과 Clipping Rect와 만나는 지점의 좌표를 구해서
                        // tracker의 위치(top, left)값을 지정해주려고 합니다.
                        // tracker 자체의 크기가 있기 때문에 원래 지도 영역보다 안쪽의 가상 영역을 그려
                        // 클리핑된 지점을 tracker의 위치로 사용합니다.
                        // 실제 tracker의 position은 화면 좌표가 될 것이므로 
                        // 계산을 위해 좌표 변환 메소드를 사용하여 모두 화면 좌표로 변환시킵니다.
                        
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
                        
                        // 회전각을 CSS transform을 사용하여 지정합니다.
                        // 브라우저 종류에따라 표현되지 않을 수도 있습니다.
                        // https://caniuse.com/#feat=transforms2d
                        balloon.style.cssText +=
                            '-ms-transform: rotate(' + angle + 'deg);' +
                            '-webkit-transform: rotate(' + angle + 'deg);' +
                            'transform: rotate(' + angle + 'deg);';
                
                        // target이 영역 밖에 있을 경우 tracker를 노출합니다.
                        setVisible(true);
                    }
                }
                
                // 상하좌우로 BOUNDS_BUFFER(30px)만큼 bounds를 확장 하는 함수
                //
                //  +-----------------------------+
                //  |              ^              |
                //  |              |              |
                //  |     +-----------------+     |
                //  |     |                 |     |
                //  |     |                 |     |
                //  |  <- |    Map Bounds   | ->  |
                //  |     |                 |     |
                //  |     |                 |     |
                //  |     +-----------------+     |
                //  |              |              |
                //  |              v              |
                //  +-----------------------------+
                //  
                // 여기서는 TooltipMaker가 완전히 안보이게 되는 시점의 영역을 구하기 위해서 사용됩니다.
                // TooltipMarker는 60x60 의 크기를 가지고 있기 때문에 
                // 지도에서 완전히 사라지려면 지도 영역을 상하좌우 30px만큼 더 드래그해야 합니다.
                // 이 함수는 현재 보이는 지도 bounds에서 상하좌우 30px만큼 확장한 bounds를 리턴합니다.
                // 이 확장된 영역은 TooltipMarker가 화면에서 보이는지를 판단하는 영역으로 사용됩니다.
                function extendBounds(bounds:any, proj:any) {
                    // 주어진 bounds는 지도 좌표 정보로 표현되어 있습니다.
                    // 이것을 BOUNDS_BUFFER 픽셀 만큼 확장하기 위해서는
                    // 픽셀 단위인 화면 좌표로 변환해야 합니다.
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
                    function calcOutcode(x:any, y:any) {
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
                
                    var code = calcOutcode(ox, oy);
                
              while(true) {
                if (!code) {
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
                code = calcOutcode(ox, oy);
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

      
            var place_data:Place_Data;
      
            var origin_name:string//시작 지점 장소 기억.
            async function convertcoordtoname(x:number,y:number){
              var opt={
                method:"GET",
                headers:{
                  Authorization:`KakaoAK ${process.env.NEXT_PUBLIC_REST_API_KEY}`
                }
              }
              var data=await fetch(`https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${x}&y=${y}`,opt)
              .then((res)=>{return res.json()}) 
    
              return data["documents"][0]["road_address"]["address_name"];
            }
    
            async function getareabyname(name:string){
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
            async function getbycategory(x:number,y:number){
            const data=await fetch(`https://dapi.kakao.com/v2/local/search/category.json?category\_group\_code=MT1&x=${x}&y=${y}&radius=1000`,{
                method:"GET",
                headers:{
                    Authorization:`KakaoAK ${process.env.NEXT_PUBLIC_REST_API_KEY}`
                }
            })
            //BK9
            .then((res)=>{
              return res.json();
            })
            console.log("category:",data);
            /*for(const x of data){
                area_mart_name.push({martName:x.road_address_name,address:x.place_name});
            }*/
            return data;
            }
            var geocoder = new window.kakao.maps.services.Geocoder();// 주소 찾기용.
            var weather_area_code={
              "109":"서울,인천,경기",
              "159":"부산,울산,경남",
              "143":"대구,경북",
              "156":"광주,전남",
              "146":"전북",
              "133":"대전,세종,충남",
              "131":"충북",
              "105":"강원"
            }
            var origin_cord:string[];//사용자가 입력한 주소의 실제 위도 경도값을 말함
            //기상청 api가 요구하는 좌표값으로 바꾸는 함수.
            function convertposition(v1:string,v2:string):GridCoordinates{
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
              var ra = Math.tan(Math.PI * 0.25 + (parseInt(v1,10) * DEGRAD * 0.5));
              ra = re * sf / Math.pow(ra, sn);
              var theta = parseInt(v2,10) * DEGRAD - olon;
              if (theta > Math.PI) theta -= 2.0 * Math.PI;
              if (theta < -Math.PI) theta += 2.0 * Math.PI;
              theta *= sn;
              //rs['x'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
              //rs['y'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
      
      
              const rs: GridCoordinates = {
                  lat: parseInt(v1, 10),
                  lng: parseInt(v2, 10),
                  x: Math.floor(ra * Math.sin(theta) + XO + 0.5),
                  y: Math.floor(ro - ra * Math.cos(theta) + YO + 0.5)
              };
      
      
          
              console.log("rs inside:",rs);
              return rs;
      
            }
            //기상청 api데이터 조회시 어떤 시각을 기준으로 조회할지 결정하는애.--->단기 현황 api에쓰는것.
            function makedate(date:Date):string[]{
              var month=""+(date.getMonth()+1);
              var year=""+date.getFullYear();
              var dt=""+date.getDate();
              const base_time_arr=[2, 5, 8, 11, 14, 17, 20, 23] 
              var hour=date.getHours();
              var hour_now:string|number=hour;
              var min=date.getMinutes();
      
              if(40>=min){
                  if(hour===0){
                      hour_now="2300";
                  }
                  else if(10>hour){
                      hour_now="0"+(hour-1).toString()+"00";
                  }
                  else{
                      hour_now=hour-1+"00";
                  }
              }
              else{
                  if(10>hour){
                      hour_now="0"+hour+"00";
                  }
                  else{
                      hour_now=hour+"00";
                  }
              }
              console.log("hour_now and hour:",hour_now,hour);
              if(date.getMonth()+1<10){
                      month="0"+(date.getMonth()+1)
                      
                  }    
              if(date.getDate()<10){
                      dt="0"+date.getDate()
              }
      
      
              return [year+month+dt,hour_now]
      
              
      
            }        
            function makeareacode(name:string){
              switch(name){
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
            function getstnid(name:string):string{
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
                      break;
                  case "전북":
                      return "146";
                  
                  case "대전":
                  case "세종":
                  case "충남":
                      return "133";
                    
                  case "충북":
                      return "131";
                      break
                  case "강원":
                      return "105";
                  default:
                      return "";
      
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
      
              return min+":"+second;
            }
            var container = document.getElementById('map');//map을 띄우기 위한 칸을 의미한다.
            var options={
            center: new window.kakao.maps.LatLng(33.450701, 126.570667),
            level: 3
            };
      
            var map= new window.kakao.maps.Map(container, options);//container로 정의된 div태그에 맵을 띄운다. 그와동시에 map이라느 변수로 받아서 
            //활용할수있게한다.

  
            let zoom_map=document.getElementById("map_zoom");
            zoom_map.addEventListener("click",()=>{

                setzoom(zoom=>{
                    const newzoom=!zoom;
                    map.setZoomable(newzoom);
                    if(newzoom!==true){
                        zoom_map.textContent="줌 꺼짐";
    
                    }
                    else{
                        zoom_map.textContent="줌 켜짐"
                    }

                    return newzoom;
                })
                
               
            })
            function getLocation() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(showPosition);
                } 
            }
      
            function showPosition(position:geolocationposition) {
                console.log("showposition:",position);
               
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
              
      
                options={
                    center: new window.kakao.maps.LatLng(37.654733159968,127.07610170472),
                    level: 3
                };
           
              map=new window.kakao.maps.Map(container, options);        
              //origin_cord=[latitude.toString(),longitude.toString()];
              origin_cord=["37.654733159968","127.07610170472"]
              console.log("origin+cord:",origin_cord)
      
              async1();
            
            } 
            async function async1(){
                console.log("Async1");         
                async function getmarker(origin_name:string){
                    
                let serviceKey=process.env.NEXT_PUBLIC_serviceKey;
                let date=new Date();
          
                var datearr=makedate(date)
          
               
                marker_save_map.clear();
                place_finded.clear();
                overlay_save_map.clear();
              
                for(const x of marker_tracker_map.values()){
                    x.stop();
                }

                marker_tracker_map.clear();
                
                //중간의 clear문과 stop의 경우 기존에 저장된 마커,polyline,overlay등을 지도에서 표시하는걸 취소하고 map을 비우기 위함이다.



                place_data=await getbycategory(Number(origin_cord[1]),Number(origin_cord[0]));
                /*const mart_data=place_data.documents.map((x)=>{
                   return {
                        martName:x.place_name,
                        martAddress:x.road_address_name
                    }
                })*/
                //console.log("mart_around:",mart_data);
                const mart_data=place_data.documents[0];
                console.log("mart_around:",mart_data);
                //localStorage.setItem("mart_around",JSON.stringify(mart_data));
                let answer=await fetch("http://localhost:3000/marts",{
                    method:'POST',
                    headers:{
                        "Content-Type":"application/json",
                        Authorization:"Bearer "+localStorage.getItem("access_token")
                    },
                    body:JSON.stringify([{martName:mart_data.place_name,
                        martAddress:mart_data.road_address_name}]
                    )
                    
                })
                .then((res)=>{return res.json()})
                localStorage.setItem("mart_around",JSON.stringify(answer.data));
                console.log("ans:",answer);
                console.log("place_Data:",place_data);
              
            
                let stnId:string="";
                var weatherdata={}
                var weather_local_data={}
                
              
                console.log("place_Data:",place_data);

                var rs=convertposition(origin_cord[0],origin_cord[1]);
                let nx=rs.x;
                let ny=rs.y;     

                let url=` http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${serviceKey}&pageNo=1&numOfRows=10&base_date=${datearr[0]}&base_time=${datearr[1]}&dataType=JSON&nx=${nx}&ny=${ny}`; 
          
                var option={
                        method:"GET"
                    }
                data=await fetch(url,option)
                    .then((result)=>{
                    return result.json();
                    })

              


                for(const x of data.response.body.items.item){
                    switch(x.category){
                        case "T1H":
                            weather_local_data["T1H"]=x.obsrValue ;
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
                                default :
                                break;

                            }
                    }
               


                let fromTmFc=datearr[0];
                let toTmFc=datearr[0];
              
                let area_name=place_data["documents"][0]["address_name"].substring(0,2);                    




                stnId=getstnid(area_name);
                var data=await fetch(`http://apis.data.go.kr/1360000/WthrWrnInfoService/getWthrWrnList?serviceKey=${serviceKey}&numOfRows=10&pageNo=1&dataType=JSON&fromTmFc=${fromTmFc}&toTmFc=${toTmFc}&stnId=${stnId}`,option)
                        .then((res)=>{
                        return res.json();
                        }
                        )

                
                try{
                    var strs=data.response.body.items.item[0].title;
                    var arr=strs.split(" ");
                    weatherdata["특보데이터"]=""
                    for(const x of arr){
                        if(x.includes("주의보")){
                            weatherdata["특보데이터"]+=x;
                        }
                    }
                }
                catch(error){
                    weatherdata["특보데이터"]=null;
                    console.log("기상특보가 없음!");
                }
                        
                finally{
                    
                    for (var i=0; i<place_data["documents"].length; i++) {
                       
                        displayMarker(place_data["documents"][i]);    
                        }      
                } 
                    

                if(weatherdata["특보데이터"]===null){
                    console.log("특보가 업성요")
                }
                else{
                    console.log(weatherdata["특보데이터"]);
                    console.log(weather_local_data);
                    console.log("현재"+weather_area_code[stnId]+"지역에"+weatherdata["특보데이터"]+"가 발생했어요");
                }

                
                for(const local_data of Object.keys(weather_local_data)){
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
                                doc1.appendChild(textNode);
                                break;
                            case "T1H":
                                console.log("현재기온:",weather_local_data[local_data]);

                                let textNode2 = document.createElement("span");
                                textNode2.textContent=(weather_local_data[local_data]+"°C");
                                textNode2.className="inline";
                                const doc2=document.getElementById(local_data)
                                doc2.appendChild(textNode2)
                                break;
                            case "VEC":
                                console.log("풍속:",weather_local_data[local_data]);

                                let textNode3= document.createElement("span");
                                textNode3.textContent=(weather_local_data[local_data]+"m/s");
                                textNode3.className="inline";
                                const doc3=document.getElementById(local_data)
                                doc3.appendChild(textNode3);
                                break;
                        }
                }


                    
              

                

      
                //place_data로부터 좌표를 불러와서 해당 좌표에 마커를 만드는과정.
                function displayMarker(place:any) {
                    console.log("displaydata:",place);
                    var marker = new window.kakao.maps.Marker({
                        map: map,
                        position: new window.kakao.maps.LatLng(place.y, place.x) 
                    });
  
                    marker_save_map.set(place.place_name,[marker,place]);
                    //marker_save_map에다가 장소명을 기준으로 마커,place_data를 저장한다.   


                }



                //weatherdata로 놀공간.

                console.log("geocoder end");

              
            
                }
                origin_name=await convertcoordtoname(Number(origin_cord[1]),Number(origin_cord[0]));
                getmarker(origin_name);


                




        
      
      
            }
      
            var btns=document.getElementById("showmarker");
            btns.addEventListener("click",()=>{
                async2();
                console.log("button");
            })
            async function async2(){
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
              marker_function_save_map.clear();
              console.log("마커 함수 저장 제거후 :",marker_function_save_map.keys());
              console.log("오버레이 키값 제거후:",overlay_save_map.keys());
              //여기까지애들은 새로운 장바구니 조건에따라 길찾기 및 마트찾기를 생각해서 overlay과 marker_tracker를 카카오 맵에서 지우고
              //초기화 하는 과정이다.
              
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
              
              let mart_price_all_data=await fetch("http://localhost:3000/marts/selling",{
                    method:'GET',
                    headers:{
                        Authorization:"Bearer "+localStorage.getItem("access_token")
                    }
                    })
                    .then((res)=>{
                        return res.json();
                    })
              for(const position of datafromback){
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
                      };
      
      
            
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
                            
                              
                          })}});
                    
                      //한 목적지에서 우리의 위치까지의 경로들을 linepath에다가 담는과정.
      
                    console.log("pods_data:",pos_data);
                    console.log("linepath:",linepath);


                    console.log("mart_price_all_data:",mart_price_all_data);
                    mart_price_all_data=mart_price_all_data.data;
                    console.log("mart_price_all_data:",mart_price_all_data);
                    console.log("position:",position);
                      makemarker(pos_data,linepath,position["martId"],mart_price_all_data)
      
                  } 
      
                  catch (error) {
                      console.error('Error:', error);
                  }
      
              }
              
            
            } 
      
      
            async function makemarker(pos_data:any,linepath:any,martid:number,mart_price_all_data:any){
                //마트이름
                pos_data[1].place_name




              var hexcolorcode="#"
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

              //디자인이 가능하ek
              const over_lay_main=document.createElement("div");
              const over_lay_serve=document.createElement("div");
              const over_lay_star=document.createElement("div");
              const over_lay_cart_list=document.createElement("div")
              const over_lay_cart_list_btn=document.createElement("button");
              over_lay_main.className="bg-green-100  rounded-lg w-[200px] h-[200px] relative"
              over_lay_serve.className="bg-red-100 rounded-lg w-full h-[150px]"
              over_lay_cart_list_btn.className="absolute bg-blue-100 w-[50px] h-[50px] right-0 bottom-0"
              over_lay_cart_list.className="absolute bg-amber-400 w-[250px] h-[250px] bottom-[50px] left-[-20px]  z-30 overflow-scrol overflow-x-hidden"
              over_lay_cart_list.style.display="none";
              over_lay_star.className="flex justify-center items-center absolute bg-slate-500 w-[150px] h-[50px] bottom-0 left-0"  

              over_lay_cart_list_btn.addEventListener("click",async ()=>{
                if(over_lay_cart_list.style.display==="none"){
                    over_lay_cart_list.style.display="block";

                    if(over_lay_cart_list.children.length===0){
                        console.log("line=0");
                  
                        const data=await fetch(`http://localhost:3000/marts/selling/${martid}`,{
                            method:'GET',
                            headers:{
                                Authorization:"Bearer "+localStorage.getItem("access_token")
                            }
                        }) 
                        .then((res)=>{
                            return res.json();
                        })
                        console.log("cartdata:",data.data);
                        if(data.data.length!==0){
                            for(const x of data.data){
                                let lists=document.createElement("li");
                                lists.textContent=x.productName+" "+x.finalPrice; 
                                over_lay_cart_list.appendChild(lists);
                            }
                            over_lay_serve.textContent+=(mart_price_all_data[martid]+"원");
                        }
                        
                        else{
                            over_lay_serve.textContent="없음";      
                        }
                    }
                    else{


                    }
                }
                else{
                        over_lay_cart_list.style.display="none";
                        
                        if(over_lay_cart_list.children.length>0){
                            let childs=over_lay_cart_list.children;
    
                            for(const x of childs){
                                x.remove();
                            }
                        }
                    
                }
              })

              function makestar(score:number){
                const a=document.createElement("a");
                score=Math.floor(score);
                let star="";
                for(let i=0;i<5;i++){
                    score>i ? star+="★" :star+="☆"
                }
                a.textContent=star;
                a.style.color="red";
                a.target="_blank";
                let m="http://localhost:3000/reviews/deatil/35"
                console.log("test:","http://localhost:3000/detail/35".substring(30,m.length))
                a.href=`http://localhost:3000/detail/${martid}`;
                over_lay_star.appendChild(a);
              };
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
              
              over_lay_main.appendChild(over_lay_serve);
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
      
            }
            getLocation(); 

        });
      }
    };

    // 컴포넌트 언마운트 시 스크립트 제거
    return () => {
      document.head.removeChild(script);
    };
  }, [location, kakao_map_api_key]);


 
  const panTo = () => {
    // 이동할 위도 경도 위치를 생성합니다
    if (typeof window !== 'undefined' && window.kakao && mapRef.current) {
      const { lat, lng } = location || { lat: 33.450701, lng: 126.570667 };
      const moveLatLon = new window.kakao.maps.LatLng(lat, lng);

      // 지도 중심을 부드럽게 이동시킵니다
      // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
      mapRef.current.panTo(moveLatLon);
    }
  };

  return (
    <div className="relative w-full h-screen-50">
        <div id="weather_bar" className=" flex justify-evenly w-full h-[50px] absolute top-0 bg-slate-100 z-40">
            <div id="T1H">
                <img src="/utils/temp.jpg" className="w-[50px] h-[50px] bg-white rounded-full inline "></img>
            </div>
            <div id="VEC">
            <img src="/utils/wind.png" className="w-[50px] h-[50px] bg-white rounded-full inline"></img>
            </div>
            <div id="RN1">
            <img src="/utils/rain.png" className="w-[50px] h-[50px] bg-white rounded-full inline"></img>
            </div>

           
        </div>
        <button id="closeopenbtn" className="w-[50px] h-[50px] bg-red-100 absolute top-[50px] right-0 z-50"onClick={()=>{closeandopen()}}>close</button>
      <div id="map" className="relative inset-0 w-full h-full"></div>
      <button
        onClick={panTo}
        className="flex justify-center absolute w-[40px] bottom-6 left-4 p-2 bg-white rounded-lg shadow-md z-10"
      >
        <img src="/utils/myLocation.png" width={15} height={40} />
      </button>
      <button
        id="showmarker"
        className="flex justify-center absolute w-[60px] bottom-6 left-20 p-2 bg-white rounded-lg shadow-md z-10"
      >
        표시하기
      </button>
      <button id="map_zoom" className="flex justify-center absolute w-[60px] bottom-6 left-[150px] p-2 bg-white rounded-lg shadow-md z-10">줌 켜짐</button>
    </div>
  );
};

export default KakaoMap;