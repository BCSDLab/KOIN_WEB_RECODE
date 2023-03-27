import { useEffect, useState } from 'react';

interface MapProps {
  latitude: number | undefined
  longitude: number | undefined
}
function useDetailMap({ latitude, longitude }: MapProps) {
  const [map, setMap] = useState<naver.maps.Map | null>(null);

  useEffect(() => {
    if (!map && latitude && longitude) {
      const newMaps = new naver.maps.Map('map', {
        center: new naver.maps.LatLng(latitude, longitude),
        maxZoom: 18,
        minZoom: 14,
        logoControl: false,
        zoomControl: true,
        scrollWheel: false,
        draggable: true,
        zoomControlOptions: {
          position: naver.maps.Position.TOP_LEFT,
        },
      });
      setMap(newMaps);
    }
  }, [latitude, longitude, map]);

  return map;
}

export default useDetailMap;
