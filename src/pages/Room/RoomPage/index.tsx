import RoomList from 'components/Room/RoomList';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import useMarker from './hooks/useMarker';
import useNaverMap from './hooks/useNaverMap';
import useRoomList from './hooks/useRoomList';
import styles from './RoomPage.module.scss';

const LOCATION = { latitude: 36.764617, longitude: 127.283154 };

function RoomPage() {
  const isMobile = useMediaQuery();
  const roomList = useRoomList();
  const map = useNaverMap(LOCATION.latitude, LOCATION.longitude);
  useMarker({ map, roomList });
  useScrollToTop();

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
