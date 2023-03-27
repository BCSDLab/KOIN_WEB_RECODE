import { LandDetailResponse } from 'api/room/entity';
import useDetailMap from 'pages/Room/RoomDetailPage/hooks/useDetailMap';
import useDetailMarker from 'pages/Room/RoomDetailPage/hooks/useDetailMarker';
import styles from './RoomDetailMap.module.scss';

interface MapProps {
  roomDetail: LandDetailResponse
}

function RoomDetailMap({ roomDetail }: MapProps) {
  const map = useDetailMap({ latitude: roomDetail?.latitude, longitude: roomDetail?.longitude });
  useDetailMarker({ map, latitude: roomDetail?.latitude, longitude: roomDetail?.longitude });
  return (
    <div className={styles.mapContainer}>
      <div className={styles.mapContainer__address}>{roomDetail?.address}</div>
      <div id="map" className={styles.mapContainer__map} />
    </div>
  );
}

export default RoomDetailMap;
