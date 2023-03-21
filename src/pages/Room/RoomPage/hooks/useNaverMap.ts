import { useEffect, useState } from 'react';

function useNaverMap() {
  const [map, setMap] = useState<naver.maps.Map | null>(null);

  useEffect(() => {
    if (!map) {
      const newMaps = new naver.maps.Map('map', {
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
      setMap(newMaps);
    }
  }, [map]);

  return map;
}

export default useNaverMap;
