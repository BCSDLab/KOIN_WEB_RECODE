import { useEffect, useRef } from 'react';

import useNaverMapsLoaded from 'components/Order/OrderDelivery/hooks/useNaverMapsLoaded';

import styles from './DeliveryMap.module.scss';

// KOIN_ORDER_WEBVIEW pages/Delivery/hooks/useNaverMap·useMarker 이전. 좌표가 바뀌면 지도를 새로 만들고 가운데에 마커를 둔다
interface DeliveryMapProps {
  latitude: number;
  longitude: number;
}

export default function DeliveryMap({ latitude, longitude }: DeliveryMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMapsLoaded = useNaverMapsLoaded();

  useEffect(() => {
    const container = containerRef.current;
    const maps = window.naver?.maps;
    if (!isMapsLoaded || !maps || !container || !latitude || !longitude) return undefined;

    const map = new maps.Map(container, {
      center: new maps.LatLng(latitude, longitude),
      zoom: 17,
      maxZoom: 20,
      minZoom: 15,
      logoControl: false,
      scrollWheel: true,
      draggable: true,
    });
    const marker = new maps.Marker({ position: map.getCenter(), map });

    return () => {
      marker.setMap(null);
      try {
        map.destroy();
      } catch {
        // Naver Maps SDK 내부 정리 타이밍 오류 방어(Room 지도와 같은 처리)
      }
    };
  }, [isMapsLoaded, latitude, longitude]);

  return <div ref={containerRef} className={styles.map} />;
}
