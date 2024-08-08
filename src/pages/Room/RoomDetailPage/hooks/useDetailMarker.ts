import { useEffect, useState } from 'react';
import MarkerIcon from 'components/Room/MarkerIcon';

interface MarkerProps {
  map: naver.maps.Map | null
  latitude: number | undefined
  longitude: number | undefined
}

function useDetailMarker({ map, latitude, longitude }: MarkerProps) {
  const [marker, setMarker] = useState<naver.maps.Marker>();

  useEffect(() => {
    if (!map || !latitude || !longitude) return;
    const newMarker = new naver.maps.Marker({
      position: new naver.maps.LatLng(latitude, longitude),
      map,
      icon: {
        content: MarkerIcon(),
      },
    });
    setMarker(newMarker);
  }, [latitude, longitude, map]);

  return marker;
}

export default useDetailMarker;
