import { useEffect, useRef } from 'react';
import { LandListResponse } from 'api/room/entity';
import MarkerIcon from 'components/Room/components/MarkerIcon';
import ROUTES from 'static/routes';
import { useRouter } from 'next/router';

interface MarkerProps {
  getMap: () => naver.maps.Map | null;
  roomList: LandListResponse | undefined;
}

function useMarker({ getMap, roomList }: MarkerProps) {
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const router = useRouter();

  useEffect(() => {
    const map = getMap();
    if (!map || !roomList || !window.naver) return;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const created = (roomList.lands ?? []).map((land) => {
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(land.latitude, land.longitude),
        title: land.name,
        map,
        icon: { content: MarkerIcon() },
        clickable: true,
      });
      marker.addListener('click', () => {
        router.push(ROUTES.RoomDetail({ id: String(land.id), isLink: true }));
      });
      return marker;
    });

    markersRef.current = created;

    return () => {
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
    };
  }, [getMap, roomList, router]);

  const getMarkerArray = () => markersRef.current;
  return { getMarkerArray };
}

export default useMarker;
