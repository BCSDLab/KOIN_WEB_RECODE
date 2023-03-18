import { useEffect, useRef } from 'react';

function useNaverMap() {
  const mapRef = useRef<naver.maps.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = new naver.maps.Map('map', {
        center: new naver.maps.LatLng(36.764617, 127.2831540),
        maxZoom: 20,
        minZoom: 15,
        logoControl: false,
        zoomControl: true,
        scrollWheel: false,
        draggable: false,
        zoomControlOptions: {
          position: naver.maps.Position.TOP_LEFT,
        },
      });
    }
  }, []);

  return mapRef.current;
}

export default useNaverMap;
