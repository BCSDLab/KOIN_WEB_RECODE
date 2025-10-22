import { useEffect, useRef } from 'react';

function useNaverMap(latitude: number, longitude: number) {
  const mapRef = useRef<naver.maps.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      const mapInstance = new naver.maps.Map('map', {
        center: new naver.maps.LatLng(latitude, longitude),
        maxZoom: 20,
        minZoom: 15,
        logoControl: false,
        zoomControl: true,
        scrollWheel: false,
        draggable: true,
        zoomControlOptions: { position: naver.maps.Position.TOP_LEFT },
      });
      mapRef.current = mapInstance;

      return () => {
        mapInstance.destroy();
        mapRef.current = null;
      };
    }

    mapRef.current.setCenter(new naver.maps.LatLng(latitude, longitude));
  }, [latitude, longitude]);

  const getMap = () => mapRef.current;

  return { getMap };
}

export default useNaverMap;
