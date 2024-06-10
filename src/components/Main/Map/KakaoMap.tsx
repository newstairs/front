'use client';
import React, { useEffect, useRef } from 'react';
import { useMap } from './MapProvider'; 

interface Location {
  lat: number;
  lng: number;
}

interface qa {
  La: number;
  Ma: number;
}

interface coords {
  accuracy: number;
  altitude: number;
  altitudeAccuracy: number;
  heading: number;
  latitude: number;
  longitude: number;
  speed: number;
}

interface geolocationposition {
  coords: coords;
  timestamp: number;
}

interface meta {
  is_end: boolean;
  pageable_count: number;
  same_name: string;
  total_throw: number;
}

interface documentarr {
  address_name: string;
  category_group_code: string;
  category_group_name: string;
  category_name: string;
  distance: number;
  id: string;
  phone: string;
  place_name: string;
  place_url: string;
  road_address_name: string;
  x: string;
  y: string;
}

interface Place_Data {
  documents: documentarr[];
  meta: meta;
}

interface MapProps {
  location: string;
}

const KakaoMap: React.FC<MapProps> = ({location}) => {
  const kakaoMap = useMap();
  const mapRef = useRef<any>(null);

  let place_finded = new Map();
  let marker_save_map: Map<string, any> = new Map();
  let overlay_save_map: Map<string, any> = new Map();
  let marker_tracker_map: Map<any, any> = new Map(); // 타입 임의로 지정해주었음
  let marker_function_save_map: Map<any, any> = new Map();

  useEffect(() => {
    if (kakaoMap) {
      // map 화면 구성 관련 설정
      const mapContainer = document.getElementById('map');
      const mapOption = {
        center: new kakaoMap.LatLng(33.450701, 126.570667),
        level: 3,
      };
      const map = new kakaoMap.Map(mapContainer, mapOption);
      mapRef.current = map;

      // 사용자 컨트롤러 버튼 생성(줌인/ 줌아웃, 그림/위성사진)
      const mapTypeControl = new kakaoMap.MapTypeControl();
      map.addControl(mapTypeControl, kakaoMap.ControlPosition.TOPLEFT);

      const zoomControl = new kakaoMap.ZoomControl();
      map.addControl(zoomControl, kakaoMap.ControlPosition.LEFT);

      const ps = new kakaoMap.services.Places(map);

      // 사용자 현 위치 정보 가져오기
      function getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition);
        }
      }

      function showPosition(position: geolocationposition) {
        console.log('showposition: ', position);

        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;

        console.log('위도, 경도:', latitude, longitude);

        // const newCenter = new kakaoMap.LatLng(latitude, longitude);
        const newCenter = new kakaoMap.LatLng(37.654733159968, 127.07610170472);

        map.setCenter(newCenter);

        origin_cord = ['37.654733159968', '127.07610170472'];
        console.log('origin_cord:', origin_cord);

        async1();
      }

      async function async1() {
        console.log('Async1');
        // let callbacks = function(result: any, status: any) {
        //   console.log("callback");
        //   if ( status === kakaoMap.services.Status.OK ) {
        //     console.log(result);
        //     origin_name = result[0].address_name;
        //     console.log("address_name::", result[0].address.address_name);

        //     getmarker(origin_name);
        //   }
        // }
        const origin_name = await convertcoordtoname(Number(origin_cord[1]), Number(origin_cord[0]));
        getmarker(origin_name);

        async function getmarker(origin_name: string) {
          const serviceKey = process.env.NEXT_PUBLIC_SERVICE_KEY;
          let date = new Date();

          let datearr = makedata(date);

          console.log('origin_name:', origin_name);

          // geocoder.addressSearch(origin_name, callback);
          console.log('callback!');

          marker_save_map.clear();
          place_finded.clear();
          overlay_save_map.clear();
          // console.log("result:",result);
          for (const x of marker_tracker_map.values()) {
            x.stop();
          }

          marker_tracker_map.clear();
          // 중간의 clear문과 stop의 경우 기존에 저장된 마커,polyline,overlay등을 지도에서 표시하는걸 취소하고 map을 비우기 위함이다.

          // 기상 정보 데이터
          place_data = await getbycategory(Number(origin_cord[1]), Number(origin_cord[0]));

          let stnId: string = '';
          let weatherdata: any = {};
          let weather_local_data: any = {};

          console.log('Place_data: ', place_data);
          let rs = convertposition(origin_cord[0], origin_cord[1]);
          let nx = rs.x;
          let ny = rs.y;

          let url = `//apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${serviceKey}&pageNo=1&numOfRows=10&base_date=${datearr[0]}&base_time=${datearr[1]}&dataType=JSON&nx=${nx}&ny=${ny}`;

          let option = {
            method: 'get',
          };

          let data = await fetch(url, option).then((result) => {
            return result.json();
          });

          for (const x of data.response.body.items.item) {
            switch (x.category) {
              case 'T1H':
                weather_local_data['T1H'] = x.obsrValue;
                break;
              case 'PTY':
                weather_local_data['PTY'] = x.obsrValue;
                break;
              case 'RN1':
                weather_local_data['RN1'] = x.obsrValue;
                break;
              case 'VEC':
                weather_local_data['VEC'] = x.obsrValue;
                break;
              default:
                break;
            }
          }
          console.log(weatherdata);

          let fromTmFc = datearr[0];
          let toTmFc = datearr[0];

          let area_name = place_data['documents'][0]['address_name'].substring(0, 2);

          stnId = getstnid(area_name);

          data = await fetch(`http://apis.data.go.kr/1360000/WthrWrnInfoService/getWthrWrnList?serviceKey=${serviceKey}&numOfRows=10&pageNo=1&dataType=JSON&fromTmFc=${fromTmFc}&toTmFc=${toTmFc}&stnId=${stnId}`, option).then((res) => {
            return res.json();
          });

          try {
            var strs = data.response.body.items.item[0].title;
            var arr = strs.split(' ');
            console.log(arr);
            weatherdata['특보데이터'] = '';
            for (const x of arr) {
              if (x.includes('주의보')) {
                weatherdata['특보데이터'] += x;
              }
            }
          } catch (error) {
            weatherdata['특보데이터'] = null;
            console.log('기상특보가 없음!');
          } finally {
            console.log('place_data:', place_data);
            for (var i = 0; i < place_data['documents'].length; i++) {
              console.log('displaying');
              displayMarker(place_data['documents'][i]);
            }
          }
          if (weatherdata['특보데이터'] === null) {
            console.log('특보가 없습니다.');
          } else {
            console.log(weatherdata['특보데이터']);
            console.log(weather_local_data);
            console.log('현재' + weather_area_code[stnId] + '지역에' + weatherdata['특보데이터'] + '가 발생했어요');
          }

          for (const local_data of Object.keys(weather_local_data)) {
            switch (local_data) {
              case 'PTY':
                console.log('강수유형');
                break;
              case 'RN1':
                console.log('강수량: ', weather_local_data[local_data]);
                break;
              case 'T1H':
                console.log('현재기온: ', weather_local_data[local_data]);
                break;
              case 'VEC':
                console.log('풍속: ', weather_local_data[local_data]);
            }
          }
          console.log('marker_Save_Mape: ', marker_save_map);

          function displayMarker(place: any) {
            console.log('displaydata: ', place);
            let marker = new kakaoMap.Marker({
              map: map,
              position: new kakaoMap.LatLng(place.y, place.x),
            });

            marker_save_map.set(place.place_name, [marker, place]);
          }
          console.log('geocoder end');
        }
      }

      let btns = document.getElementById('showmarker');
      btns.addEventListener('click', () => {
        async2();
        console.log('botton');
      });
      async function async2() {
        console.log('async2');
        console.log('marker_Save_map: ', marker_save_map);
        console.log('overlay_map: ', overlay_save_map);
        console.log('marker_function_save_map: ', marker_function_save_map);
        console.log('marker_tracker_map: ', marker_tracker_map);

        for (const key of overlay_save_map.keys()) {
          console.log('key test: ', key);

          place_finded.get(key).setMap(null);
          overlay_save_map.get(key).setMap(null);
        }

        for (const key of marker_function_save_map.keys()) {
          kakaoMap.event.removeListener(key, 'click', marker_function_save_map.get(key));
        }

        for (const x of marker_tracker_map.values()) {
          x.stop();
        }

        marker_tracker_map.clear();
        overlay_save_map.clear();
        place_finded.clear();
        marker_function_save_map.clear();
        console.log('마커 함수 저장 제거후: ', marker_function_save_map.keys());
        console.log('오버레이 키값 제거후: ', overlay_save_map.keys());

        let datafromback = ['KB국민은행 상계역지점', 'IBK기업은행365 중계주공3단지아파트', '코리아세븐 세븐-중계2호 ATM'];

        // 이 사이에 bakc에서 데이터를 받아오는 로직을 작성

        for (const position of datafromback) {
          console.log('position:', position);
          let pos_data = marker_save_map.get(position);
          console.log('pos_data: ', pos_data);

          try {
            const options = {
              method: 'post',
              headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                appKey: process.env.NEXT_PUBLIC_sk_api_key,
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
                searchOption: '10',
              }),
            };

            var data = await fetch('https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&callback=function', options).then((result) => {
              return result.json();
            });
            var linepath: qa[] = [];
            var testroute = data.features;
            console.log('roudtedata:', testroute);
            testroute.forEach((router: any, index: number) => {
              console.log(router, index);
              if ((router.geometry ?? {}).type === 'LineString') {
                router.geometry.coordinates.forEach((vertex: number[], idx: number) => {
                  linepath.push(new window.kakao.maps.LatLng(vertex[1], vertex[0]));
                });
              }
            });

            // 한 목적지에서 우리의 위치까지의 경로들을 linepath에다가 담는과정.
            console.log('pods_data:', pos_data);
            console.log('linepath:', linepath);
            makemarker(pos_data, linepath);
          } catch (error) {
            console.error('Error:', error);
          }
        }

        function makemarker(pos_data: any, linepath: any) {
          var hexcolorcode = '#';
          for (let i = 0; i < 1; i++) {
            hexcolorcode += Math.floor(Math.random() * (256 - 1) + 1).toString(16);
          }
          hexcolorcode += '0000';
          // 같은 색이면 구분안되니까 polyline에들어갈 색들을 랜덤하게 만드는 과정.

          var polyline = new window.kakao.maps.Polyline({
            map: map,
            path: linepath,
            strokeWeight: 2,
            strokeColor: hexcolorcode,
            strokeOpacity: 1,
            strokeStyle: 'line',
          }); // polyline즉 맵에 경로가 표시되는것들의 설정.

          console.log(polyline.getLength()); // 목적지에서 내위치까지의 거리를 알려줌.
          var datas = [{ name: 'emart', itemlist: [{ itemname: '사과', price: '1000' }, { itemname: '배', price: '2000' }] }];
          // 오버레이에띄울 데이터들을 테스트용으로 넣은것. 추후에 백과 연결되면  바꿀것.

          let contents = `<div class="customoverlay bg-white shadow-lg rounded-lg p-4">`;
          datas[0].itemlist.forEach((x) => {
            contents += `<div class="mb-4">
              <ul class="list-none space-y-2">
                  <li class="font-bold text-lg">martname: ${datas[0].name}</li>
                  <li>itemname: ${x.itemname}</li>
                  <li>price: ${x.price}</li>
              </ul>
            </div>`;
          });
          contents += `<div class="pt-2">${pos_data[1].place_name}</div></div>`;

          // 오버레이에 들어갈 내용들을 만드는 과정 참고로 string타입으로 들어간 각태그들의 id,class값들은 css파일의 영향을 받아서
          // 디자인이 가능하다.

          var customOverlay = new window.kakao.maps.CustomOverlay({
            map: map,
            clickable: true,
            content: contents,
            position: new window.kakao.maps.LatLng(pos_data[1].y, pos_data[1].x),
            range: 500,
            xAnchor: 1,
            yAnchor: 1,
            zIndex: 3,
          });

          // 애내둘은 아까 marker_Save_map에다가 저장해둔 마커객체,장소 데이터들을 의미한다.
          var marker = pos_data[0];
          var placename = pos_data[1].place_name;

          console.log('placename check:', placename);

          overlay_save_map.set(placename, customOverlay);
          place_finded.set(placename, polyline);
          // 오버레이, poyline들을 map에다가 장소명을 기준으로 저장.

          console.log('placename out:', placename);
          var markertracer = new MarkerTracker(map, marker);
          marker_tracker_map.set(placename, markertracer);
          markertracer.run(); // 마커트레이서 작동.

          const func = (function (placename) {
            return function () {
              console.log('click!!!');
              if (overlay_save_map.get(placename).getMap() === null) {
                overlay_save_map.get(placename).setMap(map);
                // place_finded.get(placename).setMap(map);
                marker_tracker_map.get(placename).run();
              } else {
                overlay_save_map.get(placename).setMap(null);
                // place_finded.get(placename).setMap(null);
                marker_tracker_map.get(placename).stop();
              }
            };
          })(placename);

          kakaoMap.event.addListener(marker, 'click', func);
          marker_function_save_map.set(marker, func);
        }
        getLocation();
      }

      // 현 위치에 해당하는 마커 표시
      const displayMarker = (locPosition: any, message: string) => {
        const marker = new kakaoMap.Marker({
          map: map,
          position: locPosition,
        });

        const infowindow = new kakaoMap.InfoWindow({
          content: message,
          removable: true,
        });

        infowindow.open(map, marker);
        map.setCenter(locPosition);
      };

      // 아래부터는 kakao Map api 및 기상데이터, 경로찾기 관련 로직에 필요한 함수 모음이다.

      // 마커 트래킹 로직
      function MarkerTracker(map: any, target: any) {
        let OUTCODE = {
          INSIDE: 0,
          TOP: 8,
          RIGHT: 2,
          BOTTOM: 4,
          LEFT: 1,
        };

        let BOUNDS_BUFFER = 30;

        let CLIP_BUFFER = 40;

        // 트레커, 내부 아이콘, 외부 말풍선 elements
        let tracker = document.createElement('div');
        tracker.className = 'tracker';

        let icon = document.createElement('div');
        icon.className = 'icon';

        let balloon = document.createElement('div');
        balloon.className = 'balloon';

        tracker.appendChild(balloon);
        balloon.appendChild(icon);

        map.getNode().appendChild(tracker);

        // tracker 클릭시 중심좌표 재설정
        tracker.onclick = function () {
          map.setCenter(target.getPosition());
          setVisible(false);
        };

        // target 위치 추적 함수
        function tracking() {
          let proj = map.getProjection();
          let bounds = map.getBounds();
          let extBounds = extendBounds(bounds, proj);

          if (extBounds.contain(target.getPosition())) {
            // target이 영역 안에 있는 경우
            setVisible(false);
          } else {
            // target이 영역 밖인 경우(tooltip 마커 위치, 중심좌표, 지도 남서쪽/북동쪽 끝 좌표)
            let pos = proj.containerPointFromCoords(target.getPosition());
            let center = proj.containerPointFromCoords(target.getCenter());
            let sw = proj.containerPointFromCoords(bounds.getSouthWest());
            let ne = proj.containerPointFromCoords(bounds.getNorthEast());

            let top = ne.y + CLIP_BUFFER;
            let right = ne.x - CLIP_BUFFER;
            let bottom = sw.y - CLIP_BUFFER;
            let left = sw.x + CLIP_BUFFER;

            // 계산된 좌표를 클리핑 로직에 넣어 좌표 얻어내기
            let clipPosition = getClipPosition(top, right, bottom, left, center, pos);
            // 클리핑 된 좌표 --> 트래커 좌표로 사용
            tracker.style.top = clipPosition.y + 'px';
            tracker.style.left = clipPosition.x + 'px';

            let angle = getAngle(center, pos);
            balloon.style.cssText +=
              '-ms-transform: rotate(' + angle + 'deg);' +
              '-webkit-transform: rotate(' + angle + 'deg);' +
              'transform: rotate(' + angle + 'deg;';
            // target이 영역 밖인 경우  tracker 표시
            setVisible(true);
          }
        }
        // bounds를 BOUNDS_BUFFER 만큼 bounds를 확장하는 함수
        function extendBounds(bounds: any, proj: any) {
          let sw = proj.pointFromCoords(bounds.getSouthWest());
          let ne = proj.pointFromCoords(bounds.getNorthEast());

          sw.x -= BOUNDS_BUFFER;
          sw.y += BOUNDS_BUFFER;
          ne.x += BOUNDS_BUFFER;
          ne.y -= BOUNDS_BUFFER;

          return new kakaoMap.LatLngBounds(proj.coordsFromPoint(sw), proj.coordsFromPoint(ne));
        }

        // 클리핑 된 좌표 계산하는 함수
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
              ox = ox + ((ix - ox) / (iy - oy)) * (top - oy);
              oy = top;
            } else if (code & OUTCODE.RIGHT) {
              oy = oy + ((iy - oy) / (ix - ox)) * (right - ox);
              ox = right;
            } else if (code & OUTCODE.BOTTOM) {
              ox = ox + ((ix - ox) / (iy - oy)) * (bottom - oy);
              oy = bottom;
            } else if (code & OUTCODE.LEFT) {
              oy = oy + ((iy - oy) / (ix - ox)) * (left - ox);
              ox = left;
            }
            code = calcOutcode(ox, oy);
          }
          return { x: ox, y: oy };
        }

        // 말풍선 회전각 구하는 함수
        function getAngle(center: any, target: any) {
          let dx = target.x - center.x;
          let dy = target.y - center.y;
          let deg = Math.atan2(dy, dx) * 180 / Math.PI;
          return ((-deg + 360) % 360 | 0) + 90;
        }

        // 트래커 표시 여부 지정 함수
        function setVisible(visible: any) {
          tracker.style.display = visible ? 'block' : 'none';
        }

        function hideTracker() {
          setVisible(false);
        }

        // target 위치 추적 시작
        this.run = function () {
          window.kakao.maps.event.addListener(map, 'zoom_start', hideTracker);
          window.kakao.maps.event.addListener(map, 'zoom_changed', tracking);
          window.kakao.maps.event.addListener(map, 'center_changed', tracking);
          tracking();
        };

        // target 위치 추적 중지
        this.stop = function () {
          window.kakao.maps.event.addListener(map, 'zoom_start', hideTracker);
          window.kakao.maps.event.addListener(map, 'zoom_changed', tracking);
          window.kakao.maps.event.addListener(map, 'center_changed', tracking);
          setVisible(false);
        };
      }

      let place_data: Place_Data;

      // 시작 지점 장소 기억
      async function convertcoordtoname(x: number, y: number) {
        const opt = {
          method: 'get',
          headers: {
            Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_REST_API_KEY}`,
          },
        };
        const data = await fetch(`https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${x}&y=${y}`, opt).then((res) => {
          return res.json();
        });
        return data['documents'][0]['road_address']['address_name'];
      }
      // 지역 이름 가져오기
      async function getareabyname(name: string) {
        const opt = {
          method: 'get',
          headers: {
            Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_REST_API_KEY}`,
          },
        };
        const data = await fetch(`https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(name)}`, opt).then((res) => {
          return res.json();
        });
        console.log('지역 이름: ', data);
      }

      async function getbycategory(x: number, y: number) {
        const data = await fetch(`https://dapi.kakao.com/v2/local/search/category.json?category_group_code=BK9&x=${x}&y=${y}&radius=300`, {
          method: 'get',
          headers: {
            Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_REST_API_KEY}`,
          },
        }).then((res) => {
          return res.json();
        });
        console.log('category:', data);

        return data;
      }

      // 사용자가 입력한 주소 찾기 및 실제 위도 경도 구하기

      const geocoder = new window.kakao.maps.services.Geocoder();

      const weather_area_code = {
        105: '강원',
        109: '서울, 인천, 경기',
        131: '충북',
        133: '대전, 세종, 충남',
        143: '대구, 경북',
        146: '전북',
        156: '광주, 전남',
        159: '부산, 울산, 경남',
      };

      let origin_cord: string[];

      interface GridCoordinates {
        lat: number;
        lng: number;
        x: number;
        y: number;
      }

      interface router {
        geometry: { type: string; coordinates: number[][] };
        properties: any;
        type: string;
      }

      // 기상 정보 로직
      // 기상청 api가 요구하는 좌표값으로 변환하는 함수.
      function convertposition(v1: string, v2: string): GridCoordinates {
        let RE = 6371.00877;
        let GRID = 5.0;
        let SLAT1 = 30.0;
        let SLAT2 = 60.0;
        let OLON = 126.0;
        let OLAT = 38.0;
        let XO = 43.0;
        let YO = 136.0;
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

        let ra = Math.tan(Math.PI * 0.25 + parseInt(v1, 10) * DEGRAD * 0.5);
        ra = re * sf / Math.pow(ra, sn);
        let theta = (parseInt(v2, 10) * DEGRAD) - olon;
        theta *= sn;

        const rs: GridCoordinates = {
          lat: parseInt(v1, 10),
          lng: parseInt(v2, 10),
          x: Math.floor(ra * Math.sin(theta) + XO + 0.5),
          y: Math.floor(ro - ra * Math.cos(theta) + YO + 0.5),
        };
        console.log('re inside: ', rs);
        return rs;
      }

      // 기상청 api 데이터를 어떤 시각 기준으로 조회할 것인지에 관해(단기 현황 api)
      function makedata(date: Date): string[] {
        let month = '' + (date.getMonth() + 1);
        let year = '' + date.getFullYear();
        let dt = '' + date.getDate();
        const base_time_arr = [2, 5, 8, 11, 14, 17, 20, 23];
        let hour = date.getHours();
        let hour_now: string | number = hour;
        let min = date.getMinutes();

        if (40 >= min) {
          if (hour === 0) {
            hour_now = '2300';
          } else if (10 > hour) {
            hour_now = '0' + (hour - 1).toString() + '00';
          } else {
            hour_now = hour - 1 + '00';
          }
        } else {
          if (10 > hour) {
            hour_now = '0' + hour + '00';
          } else {
            hour_now = hour + '00';
          }
        }
        console.log('hour_now and hour: ', hour_now, hour);
        if (date.getMonth() + 1 < 10) {
          month = '0' + (date.getMonth() + 1);
        }
        if (date.getDate() < 10) {
          dt = '0' + date.getDate();
        }

        return [year + month + dt, hour_now];
      }

      // 지역코드 생성
      function makeareacode(name: string) {
        switch (name) {
          case '강원도':
            return '105';
          case '서울':
          case '인천':
          case '경기도':
            return '109';
          case '충북':
            return '131';
          case '대전':
          case '세종':
          case '충남':
            return '133';
          case '대구':
          case '경북':
            return '143';
          case '전북':
            return '146';
          case '광주':
          case '전남':
            return '156';
          case '부산':
          case '울산':
          case '경남':
            return '159';
        }
      }
      // 두글자 지역명으로 지역코드 얻어오기
      function getstnid(name: string): string {
        switch (name) {
          case '강원':
            return '105';
          case '서울':
          case '인천':
          case '경기':
            return '109';
          case '충북':
            return '131';
          case '대전':
          case '세종':
          case '충남':
            return '133';
          case '대구':
          case '경북':
            return '143';
          case '전북':
            return '146';
          case '광주':
          case '전남':
            return '156';
          case '부산':
          case '울산':
          case '경남':
            return '159';
          default:
            return '';
        }
      }

      // 시간변화 보여주는 함수(시계 느낌)
      function timechange(time: number): string {
        let min: number | string = Math.floor(time / 60);
        let second: number | string = time - min * 60;

        if (min < 10) {
          min = '0' + min;
        }
        if (second < 10) {
          second = '0' + second;
        }
        return min + ':' + second;
      }
    }
  }, [kakaoMap]);

  // 중심좌표로 이동하는 로직
  const panTo = () => {
    if (kakaoMap && mapRef.current) {
      if (typeof kakaoMap !== 'undefined') {
        const { lat, lng } = location || { lat: 33.450701, lng: 126.570667 };
        const moveLatLon = new kakaoMap.LatLng(lat, lng);

        mapRef.current.panTo(moveLatLon);
      }
    }
  };

  // 화면에 보여줄 html
  return (
    <div className='relative flex w-full h-full'>
      <div id='map' className='relative inset-0 w-full h-full'></div>
      <button
        onClick={panTo}
        className='absolute flex justify-center w-[45px] z-10 bottom-4 right-4 bg-white p-2 rounded shadow'
      >
        <img width='20px' src='./images/myLocation.png' />
      </button>
    </div>
  );
};

export default KakaoMap;
