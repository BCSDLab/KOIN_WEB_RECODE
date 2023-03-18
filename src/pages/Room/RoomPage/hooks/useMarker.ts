import { useEffect, useState } from 'react';
import { LandListResponse } from 'api/room/entity';
import MarkerIcon from 'components/Room/MarkerIcon';

interface MarkerProps {
  map: naver.maps.Map | null;
  roomList: LandListResponse | undefined;
}

function useMarker({ map, roomList }: MarkerProps) {
  const [markerArray, setMarkerArray] = useState<naver.maps.Marker[]>([]);
  useEffect(() => {
    const newMarkers: naver.maps.Marker[] = [];
    if (map) {
      roomList?.lands.map((room) => {
        const markers = new naver.maps.Marker({
          position: new naver.maps.LatLng(room.latitude, room.longitude),
          title: room.name,
          map,
          icon: {
            content: MarkerIcon(),
          },
        });
        newMarkers.push(markers);
        return newMarkers;
      });
    }
    setMarkerArray(newMarkers);
  }, [map, roomList?.lands]);

  return markerArray;
}

export default useMarker;
