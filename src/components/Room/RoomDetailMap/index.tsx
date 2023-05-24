import useDetailMarker from 'pages/Room/RoomDetailPage/hooks/useDetailMarker';
import useNaverMap from 'pages/Room/RoomPage/hooks/useNaverMap';
import styles from './RoomDetailMap.module.scss';

interface MapProps {
  latitude: number
  longitude: number
  address: string
}

function RoomDetailMap({ latitude, longitude, address }: MapProps) {
  const map = useNaverMap(latitude, longitude);
  useDetailMarker({ map, latitude, longitude });
  return (
    <div className={styles['map-container']}>
      <div className={styles['map-container__address']}>{address}</div>
      <div id="map" className={styles['map-container__map']} />
    </div>
  );
}

export default RoomDetailMap;
