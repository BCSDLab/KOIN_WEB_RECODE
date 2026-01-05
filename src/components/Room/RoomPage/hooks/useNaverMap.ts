import { useEffect, useRef } from 'react';

function useNaverMap(latitude: number, longitude: number, isLoaded: boolean = true) {
  const mapRef = useRef<naver.maps.Map | null>(null);

  useEffect(() => {
    if (!isLoaded || !window.naver?.maps) return;
    if (!document.getElementById('map')) return;

    if (!mapRef.current) {
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
        mapInstance.destroy();
        mapRef.current = null;
      };
    }

    mapRef.current.setCenter(new window.naver.maps.LatLng(latitude, longitude));
  }, [isLoaded, latitude, longitude]);

  const getMap = () => mapRef.current;

  return { getMap };
}

export default useNaverMap;
