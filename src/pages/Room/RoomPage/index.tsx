import useMediaQuery from 'utils/hooks/useMediaQuery';
import RoomList from 'components/Room/RoomList';
import useRoomList from './hooks/useRoomList';
import styles from './RoomPage.module.scss';
import useNaverMap from './hooks/useNaverMap';
import useMarker from './hooks/useMarker';

function RoomPage() {
  const isMobile = useMediaQuery();
  const roomList = useRoomList();
  const location = { latitude: 36.764617, longitude: 127.2831540 };
  const map = useNaverMap(location.latitude, location.longitude);
  useMarker({ map, roomList });

  return (
    <div className={styles.template}>
      {!isMobile && <h1 className={styles.title}>복덕방</h1>}
      <div className={styles.content}>
        <div id="map" className={styles.map} />
        <RoomList lands={roomList?.lands} />
      </div>
    </div>
  );
}

export default RoomPage;
