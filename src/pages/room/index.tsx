import { QueryClient, dehydrate, useQuery } from '@tanstack/react-query';
import { roomQueries } from 'api/room/queries';
import { SSRLayout } from 'components/layout';
import RoomList from 'components/Room/components/RoomList';
import useMarker from 'components/Room/RoomPage/hooks/useMarker';
import useNaverMap from 'components/Room/RoomPage/hooks/useNaverMap';
import useNaverMapScript from 'components/Room/RoomPage/hooks/useNaverMapScript';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import styles from './RoomPage.module.scss';

const LOCATION = { latitude: 36.764617, longitude: 127.283154 };

export const getServerSideProps = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(roomQueries.list());

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

function RoomPage() {
  const isMobile = useMediaQuery();
  const { data: roomList } = useQuery(roomQueries.list());
  const isMapLoaded = useNaverMapScript();
  const { getMap } = useNaverMap(LOCATION.latitude, LOCATION.longitude, isMapLoaded);
  useMarker({ getMap, roomList });
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

RoomPage.getLayout = (page: React.ReactElement) => <SSRLayout>{page}</SSRLayout>;
