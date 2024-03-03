/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

function useNaverMap(latitude: number, longitude: number) {
  const [map, setMap] = useState<naver.maps.Map | null>(null);

  useEffect(() => {
    if (!map) {
      const newMaps = new naver.maps.Map('map', {
        center: new naver.maps.LatLng(latitude, longitude),
        maxZoom: 20,
        minZoom: 15,
        logoControl: false,
        zoomControl: true,
        scrollWheel: false,
        draggable: true,
        zoomControlOptions: {
          position: naver.maps.Position.TOP_LEFT,
        },
      });
      setMap(newMaps);

      return () => {
        newMaps.destroy();
      };
    }

    return () => {};
  }, [latitude, longitude]);

  return map;
}

export default useNaverMap;
