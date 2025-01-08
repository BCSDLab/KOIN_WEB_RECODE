import { useEffect, useState } from 'react';
import { LandListResponse } from 'api/room/entity';
import MarkerIcon from 'components/Room/MarkerIcon';
import { useNavigate } from 'react-router-dom';
import ROUTES from 'static/routes';

interface MarkerProps {
  map: naver.maps.Map | null;
  roomList: LandListResponse | undefined;
}

function useMarker({ map, roomList }: MarkerProps) {
  const [markerArray, setMarkerArray] = useState<naver.maps.Marker[]>([]);
  const navigate = useNavigate();

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
        clickable: true,
      });
      marker.addListener('click', () => {
        navigate(ROUTES.RoomDetail({ id: String(land.id), isLink: true }));
      });
      return marker;
    });
    setMarkerArray(newMarkers);
  }, [map, roomList, navigate]);

  return { markerArray };
}

export default useMarker;
