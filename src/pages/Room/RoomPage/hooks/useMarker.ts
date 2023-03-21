import { useCallback, useEffect, useState } from 'react';
import { LandListResponse } from 'api/room/entity';
import MarkerIcon from 'components/Room/MarkerIcon';

interface MarkerProps {
  map: React.MutableRefObject<naver.maps.Map | null>
  roomList: LandListResponse | undefined
}

function useMarker({ map, roomList }: MarkerProps) {
  const [markerArray, setMarkerArray] = useState<naver.maps.Marker[]>([]);

  const createMarker = useCallback(() => {
    const newMarkers: naver.maps.Marker[] = [];
    if (map.current && roomList) {
      roomList?.lands.map((room) => {
        const markers = new naver.maps.Marker({
          position: new naver.maps.LatLng(room.latitude, room.longitude),
          title: room.name,
          map: map.current as naver.maps.Map,
          icon: {
            content: MarkerIcon(),
          },
        });
        newMarkers.push(markers);
        return newMarkers;
      });
    }
    setMarkerArray(newMarkers);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomList]);

  useEffect(() => {
    createMarker();
  }, [createMarker]);

  return { markerArray };
}

export default useMarker;
