import { useEffect, useState } from 'react';
import { LandListResponse } from 'api/room/entity';
import MarkerIcon from 'components/Room/MarkerIcon';

interface MarkerProps {
  map: naver.maps.Map | null
  roomList: LandListResponse | undefined
}

function useMarker({ map, roomList }: MarkerProps) {
  const [markerArray, setMarkerArray] = useState<naver.maps.Marker[]>([]);

  useEffect(() => {
    if (!map || !roomList) return;
    const newMarkers = (roomList.lands ?? []).map((land) => {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(land.latitude, land.longitude),
        title: land.name,
        map,
        icon: {
          content: MarkerIcon(),
        },
      });
      return marker;
    });
    setMarkerArray(newMarkers);
  }, [map, roomList]);

  return { markerArray };
}

export default useMarker;
