import { useEffect, useRef, useState } from 'react';

import type { PaymentInfoResponse } from 'api/order/entity';
import useNaverGeocode from 'components/Order/OrderDelivery/hooks/useNaverGeocode';
import useNaverMapsLoaded from 'components/Order/OrderDelivery/hooks/useNaverMapsLoaded';

import styles from './OrderMap.module.scss';

// KOIN_ORDER_WEBVIEW pages/OrderFinish/components/OrderMap·ShopMarker·hooks/useMarkers 이전.
// 배달은 배달지 좌표로, 포장은 가게 주소를 지오코딩한 좌표로 지도를 만든다(useNaverMap: zoom 17, 15~20).
// 배달이면 배달지·가게가 모두 보이게 맞추고(fitBounds, 여백 10), 포장이면 가게를 가운데에 zoom 16으로 둔다.
// 지도 로더·지오코딩은 배달지 선택 화면(B7)의 훅을 함께 쓴다
interface OrderMapProps {
  paymentInfo: PaymentInfoResponse;
}

// order public/home.svg 그대로(흰 아이콘 아래 #F8F8FA 경로까지). order는 정적 경로(/home.svg)로 불러오는데,
// 같은 이미지를 base64 data URI로 넘긴다. 퍼센트 인코딩 data URI는 정적 파일과 래스터 결과가 달라진다
const HOME_MARKER_SVG = `<svg width="34" height="36" viewBox="0 0 34 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="34" height="30" rx="8" fill="#CE86FD"/>
<path d="M24.2431 13.6866L17.4931 7.68655C17.3562 7.56631 17.1803 7.5 16.9981 7.5C16.8159 7.5 16.6399 7.56631 16.5031 7.68655L9.75307 13.6866C9.63835 13.788 9.55745 13.9222 9.52125 14.071C9.48505 14.2199 9.49528 14.3762 9.55057 14.5191C9.60496 14.66 9.70065 14.7812 9.82511 14.8669C9.94957 14.9525 10.097 14.9986 10.2481 14.9991H10.9981V21.7491C10.9981 21.948 11.0771 22.1387 11.2177 22.2794C11.3584 22.42 11.5492 22.4991 11.7481 22.4991H22.2481C22.447 22.4991 22.6378 22.42 22.7784 22.2794C22.9191 22.1387 22.9981 21.948 22.9981 21.7491V14.9991H23.7481C23.8992 14.9986 24.0466 14.9525 24.171 14.8669C24.2955 14.7812 24.3912 14.66 24.4456 14.5191C24.5009 14.3762 24.5111 14.2199 24.4749 14.071C24.4387 13.9222 24.3578 13.788 24.2431 13.6866ZM17.7481 20.9991H16.2481V18.7491C16.2481 18.5501 16.3271 18.3594 16.4677 18.2187C16.6084 18.0781 16.7992 17.9991 16.9981 17.9991C17.197 17.9991 17.3878 18.0781 17.5284 18.2187C17.6691 18.3594 17.7481 18.5501 17.7481 18.7491V20.9991ZM21.4981 20.9991H19.2481V18.7491C19.2481 18.1523 19.011 17.58 18.5891 17.1581C18.1671 16.7361 17.5948 16.4991 16.9981 16.4991C16.4013 16.4991 15.829 16.7361 15.4071 17.1581C14.9851 17.58 14.7481 18.1523 14.7481 18.7491V20.9991H12.4981V14.9991H21.4981V20.9991ZM12.2206 13.4991L16.9981 9.25405L21.7756 13.4991H12.2206Z" fill="#F8F8FA"/>
<path d="M24.2431 13.6866L17.4931 7.68655C17.3562 7.56631 17.1803 7.5 16.9981 7.5C16.8159 7.5 16.6399 7.56631 16.5031 7.68655L9.75307 13.6866C9.63835 13.788 9.55745 13.9222 9.52125 14.071C9.48505 14.2199 9.49528 14.3762 9.55057 14.5191C9.60496 14.66 9.70065 14.7812 9.82511 14.8669C9.94957 14.9525 10.097 14.9986 10.2481 14.9991H10.9981V21.7491C10.9981 21.948 11.0771 22.1387 11.2177 22.2794C11.3584 22.42 11.5492 22.4991 11.7481 22.4991H22.2481C22.447 22.4991 22.6378 22.42 22.7784 22.2794C22.9191 22.1387 22.9981 21.948 22.9981 21.7491V14.9991H23.7481C23.8992 14.9986 24.0466 14.9525 24.171 14.8669C24.2955 14.7812 24.3912 14.66 24.4456 14.5191C24.5009 14.3762 24.5111 14.2199 24.4749 14.071C24.4387 13.9222 24.3578 13.788 24.2431 13.6866ZM17.7481 20.9991H16.2481V18.7491C16.2481 18.5501 16.3271 18.3594 16.4677 18.2187C16.6084 18.0781 16.7992 17.9991 16.9981 17.9991C17.197 17.9991 17.3878 18.0781 17.5284 18.2187C17.6691 18.3594 17.7481 18.5501 17.7481 18.7491V20.9991ZM21.4981 20.9991H19.2481V18.7491C19.2481 18.1523 19.011 17.58 18.5891 17.1581C18.1671 16.7361 17.5948 16.4991 16.9981 16.4991C16.4013 16.4991 15.829 16.7361 15.4071 17.1581C14.9851 17.58 14.7481 18.1523 14.7481 18.7491V20.9991H12.4981V14.9991H21.4981V20.9991ZM12.2206 13.4991L16.9981 9.25405L21.7756 13.4991H12.2206Z" fill="white"/>
<path d="M12 30H22L17 36L12 30Z" fill="#CE86FD"/>
</svg>
`;

const HOME_MARKER_URL = `data:image/svg+xml;base64,${btoa(HOME_MARKER_SVG)}`;

// order ShopMarker: 말풍선 꼬리(::after) 높이만큼 기준점을 아래로 둔다
const SHOP_MARKER_ARROW_HEIGHT = 6;

function createShopMarkerContent(container: HTMLElement, name: string) {
  const element = document.createElement('div');
  element.className = styles['shop-marker'];

  const label = document.createElement('div');
  label.className = styles['shop-marker__text'];
  label.textContent = name;
  element.appendChild(label);

  // order처럼 화면 밖에 잠시 붙여 크기를 잰다. 지도와 같은 글꼴을 받도록 지도 컨테이너 안에서 잰다
  element.style.visibility = 'hidden';
  element.style.position = 'absolute';
  element.style.left = '-99999px';
  container.appendChild(element);

  const anchorX = element.offsetWidth / 2;
  const anchorY = element.offsetHeight + SHOP_MARKER_ARROW_HEIGHT;

  container.removeChild(element);
  element.style.visibility = '';
  element.style.position = '';
  element.style.left = '';

  return { element, anchorX, anchorY };
}

// 언마운트 때는 지도 정리 효과가 먼저 돌아 이미 없어진 지도에서 마커를 떼게 된다
function removeMarker(marker: naver.maps.Marker) {
  try {
    marker.setMap(null);
  } catch {
    // 지도가 먼저 정리된 경우
  }
}

export default function OrderMap({ paymentInfo }: OrderMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMapsLoaded = useNaverMapsLoaded();
  const [map, setMap] = useState<naver.maps.Map | null>(null);

  const isDelivery = paymentInfo.order_type === 'DELIVERY';
  const [shopLatitude, shopLongitude] = useNaverGeocode(paymentInfo.shop_address, isMapsLoaded);

  const homeLatitude = paymentInfo.latitude ?? 0;
  const homeLongitude = paymentInfo.longitude ?? 0;
  const latitude = isDelivery ? homeLatitude : shopLatitude;
  const longitude = isDelivery ? homeLongitude : shopLongitude;
  const shopName = paymentInfo.shop_name;

  // order useNaverMap: 지도는 중심 좌표가 바뀔 때만 새로 만든다(배달은 배달지 좌표라 가게 지오코딩을 기다리지 않는다)
  useEffect(() => {
    const container = containerRef.current;
    const maps = window.naver?.maps;
    if (!isMapsLoaded || !maps || !container || !latitude || !longitude) return undefined;

    const created = new maps.Map(container, {
      center: new maps.LatLng(latitude, longitude),
      zoom: 17,
      maxZoom: 20,
      minZoom: 15,
      logoControl: false,
      scrollWheel: true,
      draggable: true,
    });
    // order OrderMap: 지도를 받은 뒤 확대 범위를 넓힌다
    created.setOptions({ minZoom: 0, maxZoom: 21 });
    setMap(created);

    return () => {
      setMap(null);
      try {
        created.destroy();
      } catch {
        // Naver Maps SDK 내부 정리 타이밍 오류 방어(배달지 지도와 같은 처리)
      }
    };
  }, [isMapsLoaded, latitude, longitude]);

  // order useMarkers: 배달지 마커
  useEffect(() => {
    const maps = window.naver?.maps;
    if (!map || !maps || !isDelivery) return undefined;

    const marker = new maps.Marker({
      map,
      position: new maps.LatLng(homeLatitude, homeLongitude),
      zIndex: 20,
      icon: {
        url: HOME_MARKER_URL,
        size: new maps.Size(48, 48),
        scaledSize: new maps.Size(28, 28),
        anchor: new maps.Point(14, 28),
      },
      animation: maps.Animation.DROP,
    });

    return () => removeMarker(marker);
  }, [map, isDelivery, homeLatitude, homeLongitude]);

  // order ShopMarker: 가게 좌표는 지오코딩이 끝난 뒤에 생긴다
  useEffect(() => {
    const container = containerRef.current;
    const maps = window.naver?.maps;
    if (!map || !maps || !container || !shopLatitude || !shopLongitude) return undefined;

    const { element, anchorX, anchorY } = createShopMarkerContent(container, shopName);
    const marker = new maps.Marker({
      map,
      position: new maps.LatLng(shopLatitude, shopLongitude),
      icon: { content: element, anchor: new maps.Point(anchorX, anchorY) },
      animation: maps.Animation.DROP,
    });

    return () => removeMarker(marker);
  }, [map, shopLatitude, shopLongitude, shopName]);

  // 배달이면 배달지·가게가 모두 보이게, 포장이면 가게를 가운데에 zoom 16으로 둔다
  useEffect(() => {
    const maps = window.naver?.maps;
    // 가게 좌표가 아직 없으면 지도를 만든 그대로(중심 좌표, zoom 17) 기다린다
    if (!map || !maps || !shopLatitude || !shopLongitude) return;

    if (isDelivery) {
      const home = new maps.LatLng(homeLatitude, homeLongitude);
      const shop = new maps.LatLng(shopLatitude, shopLongitude);
      const bounds = new maps.LatLngBounds(home, home);
      bounds.extend(shop);
      map.fitBounds(bounds, { top: 10, right: 10, bottom: 10, left: 10 });
    } else {
      map.setCenter(new maps.LatLng(shopLatitude, shopLongitude));
      map.setZoom(16);
    }
  }, [map, isDelivery, homeLatitude, homeLongitude, shopLatitude, shopLongitude]);

  return <div ref={containerRef} className={styles.map} />;
}
