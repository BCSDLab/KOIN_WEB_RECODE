import { useEffect, useRef } from 'react';
import MarkerIcon from 'components/Room/components/MarkerIcon';

interface DetailMarkerProps {
  getMap: () => naver.maps.Map | null;
  latitude: number | undefined;
  longitude: number | undefined;
}

export default function useDetailMarker({ getMap, latitude, longitude }: DetailMarkerProps) {
  const markerRef = useRef<naver.maps.Marker | null>(null);

  useEffect(() => {
    const map = getMap();
    if (!map || latitude == null || longitude == null || !window.naver) return;

    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }

    const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(latitude, longitude),
      map,
      icon: { content: MarkerIcon() },
    });
    markerRef.current = marker;

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
    };
  }, [getMap, latitude, longitude]);

  const getMarker = () => markerRef.current;

  return { getMarker };
}
