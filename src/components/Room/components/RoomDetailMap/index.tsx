import useDetailMarker from 'components/Room/RoomDetailPage/hooks/useDetailMarker';
import useNaverMap from 'components/Room/RoomPage/hooks/useNaverMap';
import styles from './RoomDetailMap.module.scss';

interface RoomDetailMapProps {
  latitude: number;
  longitude: number;
  address: string;
}

function RoomDetailMap({ latitude, longitude, address }: RoomDetailMapProps) {
  const { getMap } = useNaverMap(latitude, longitude);
  useDetailMarker({ getMap, latitude, longitude });
  return (
    <div className={styles['map-container']}>
      <div className={styles['map-container__address']}>{address}</div>
      <div id="map" className={styles['map-container__map']} />
    </div>
  );
}

export default RoomDetailMap;
