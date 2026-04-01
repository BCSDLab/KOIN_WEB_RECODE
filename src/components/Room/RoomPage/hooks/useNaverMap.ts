import { useEffect, useRef } from 'react';

function useNaverMap(latitude: number, longitude: number, isLoaded: boolean = true) {
  const mapRef = useRef<naver.maps.Map | null>(null);

  useEffect(() => {
    if (!isLoaded || !window.naver?.maps) return;
    if (!document.getElementById('map')) return;

    const mapInstance = new window.naver.maps.Map('map', {
      center: new window.naver.maps.LatLng(latitude, longitude),
      maxZoom: 20,
      minZoom: 15,
      logoControl: false,
      zoomControl: true,
      scrollWheel: false,
      draggable: true,
      zoomControlOptions: { position: window.naver.maps.Position.TOP_LEFT },
    });
    mapRef.current = mapInstance;

    return () => {
      try {
        mapInstance.destroy();
      } catch {
        // Naver Maps SDK 내부 _clearSwipe 타이밍 이슈 방어
      }
      mapRef.current = null;
    };
  }, [isLoaded, latitude, longitude]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setCenter(new window.naver.maps.LatLng(latitude, longitude));
    }
  }, [latitude, longitude]);

  const getMap = () => mapRef.current;

  return { getMap };
}

export default useNaverMap;
