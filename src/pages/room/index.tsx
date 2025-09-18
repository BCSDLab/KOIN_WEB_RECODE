import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import RoomList from 'components/Room/components/RoomList';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import useRoomList from 'components/Room/RoomPage/hooks/useRoomList';
import useNaverMap from 'components/Room/RoomPage/hooks/useNaverMap';
import useMarker from 'components/Room/RoomPage/hooks/useMarker';
import styles from './RoomPage.module.scss';

const LOCATION = { latitude: 36.764617, longitude: 127.2831540 };

function RoomPage() {
  const isMobile = useMediaQuery();
  const roomList = useRoomList();
  const map = useNaverMap(LOCATION.latitude, LOCATION.longitude);
  useMarker({ map, roomList });
  useScrollToTop();

  return (
    <div className={styles.template}>
      <h1 className={isMobile ? styles.hidden : styles.title}>복덕방</h1>
      <div className={styles.content}>
        <div id="map" className={styles.map} />
        <RoomList lands={roomList?.lands} />
      </div>
    </div>
  );
}

export default RoomPage;
