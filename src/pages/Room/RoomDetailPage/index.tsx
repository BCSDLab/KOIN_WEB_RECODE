import { useParams } from 'react-router-dom';
import RoomDetailImg from 'components/Room/RoomDetailImg';
import RoomDetailOption from 'components/Room/RoomDetailOption';
import RoomDetailTable from 'components/Room/RoomDetailTable';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import useRoomDetail from './hooks/useRoomDetail';
import styles from './RoomDetailPage.module.scss';

function RoomDetailPage() {
  const isMobile = useMediaQuery();
  const params = useParams();
  const roomDetail = useRoomDetail(params.id);
  return (
    <div className={styles.template}>
      <div>{!isMobile && <h1 className={styles.title}>복덕방</h1>}</div>
      <div className={styles.name}>
        {roomDetail?.name}
      </div>
      <div className={styles.info}>
        <h2 className={styles.info__title}>원룸 정보</h2>
        {roomDetail && (
        <RoomDetailTable
          monthlyFee={roomDetail?.monthly_fee}
          roomType={roomDetail?.room_type}
          charterFee={roomDetail?.charter_fee}
          deposit={roomDetail?.deposit}
          floor={roomDetail?.floor}
          managementFee={roomDetail?.management_fee}
          size={roomDetail?.size}
          phone={roomDetail?.phone}
        />
        )}
        {roomDetail && <RoomDetailImg imgUrl={roomDetail?.image_urls} />}
      </div>
      <div className={styles.info}>
        <h2 className={styles.info__title}>원룸 옵션</h2>
        {roomDetail && <RoomDetailOption roomDetail={roomDetail} />}
      </div>
    </div>
  );
}

export default RoomDetailPage;
