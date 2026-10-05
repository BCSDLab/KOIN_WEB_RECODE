import useDetailMarker from 'components/Room/RoomDetailPage/hooks/useDetailMarker';
import useNaverMap from 'components/Room/RoomPage/hooks/useNaverMap';
import useNaverMapScript from 'components/Room/RoomPage/hooks/useNaverMapScript';
import styles from './RoomDetailMap.module.scss';

interface RoomDetailMapProps {
  latitude: number;
  longitude: number;
  address: string;
}

function RoomDetailMap({ latitude, longitude, address }: RoomDetailMapProps) {
  const isMapLoaded = useNaverMapScript();
  const { getMap } = useNaverMap(latitude, longitude, isMapLoaded);
  useDetailMarker({ getMap, latitude, longitude });
  return (
    <div className={styles['map-container']}>
      <div className={styles['map-container__address']}>{address}</div>
      <div id="map" className={styles['map-container__map']} />
    </div>
  );
}

export default RoomDetailMap;
