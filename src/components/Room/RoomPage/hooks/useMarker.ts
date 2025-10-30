import { useEffect, useState } from 'react';
import { LandListResponse } from 'api/room/entity';
import MarkerIcon from 'components/Room/components/MarkerIcon';
import ROUTES from 'static/routes';
import { useRouter } from 'next/router';

interface MarkerProps {
  map: naver.maps.Map | null;
  roomList: LandListResponse | undefined;
}

function useMarker({ map, roomList }: MarkerProps) {
  const [markerArray, setMarkerArray] = useState<naver.maps.Marker[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!map || !roomList || !window.naver) return;
    const newMarkers = (roomList.lands ?? []).map((land) => {
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(land.latitude, land.longitude),
        title: land.name,
        map,
        icon: {
          content: MarkerIcon(),
        },
        clickable: true,
      });
      marker.addListener('click', () => {
        router.push(ROUTES.RoomDetail({ id: String(land.id), isLink: true }));
      });
      return marker;
    });
    setMarkerArray(newMarkers);
  }, [map, roomList, router]);

  return { markerArray };
}

export default useMarker;
