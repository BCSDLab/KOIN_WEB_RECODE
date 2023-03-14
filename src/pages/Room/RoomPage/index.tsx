import {
  Container as MapDiv, NaverMap, useNavermaps, Marker,
} from 'react-naver-maps';
import ReactDOMServer from 'react-dom/server';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import MarkerIcon from 'components/Room/MarkerIcon';
import RoomList from 'components/Room/RoomList';
import useRoomList from './hooks/useRoomList';
import styles from './RoomPage.module.scss';

function RoomPage() {
  const isMobile = useMediaQuery();
  const naverMaps = useNavermaps();
  const roomList = useRoomList();
  return (
    <div className={styles.template}>
      {!isMobile && <h1 className={styles.title}>복덕방</h1>}
      <div className={styles.content}>
        <MapDiv className={styles.map}>
          <NaverMap
            maxZoom={20}
            minZoom={15}
            logoControl={false}
            zoomControl
            scrollWheel={false}
            zoomControlOptions={{
              position: naverMaps.Position.TOP_LIFT,
            }}
            defaultCenter={{ lat: 36.764617, lng: 127.2831540 }}
            defaultZoom={16}
            draggable
          >
            {roomList?.lands.map((room) => (
              <Marker
                key={room.id}
                position={new naverMaps.LatLng(room.latitude, room.longitude)}
                title={room.name}
                icon={{
                  content: ReactDOMServer.renderToString(<MarkerIcon />),
                }}
              />
            ))}
          </NaverMap>
        </MapDiv>
        <RoomList lands={roomList?.lands} />
      </div>
    </div>
  );
}

export default RoomPage;
