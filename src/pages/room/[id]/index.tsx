import RoomDetailImg from 'components/Room/components/RoomDetailImg';
import RoomDetailOption from 'components/Room/components/RoomDetailOption';
import RoomDetailTable from 'components/Room/components/RoomDetailTable';
import RoomDetailMap from 'components/Room/components/RoomDetailMap';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import useRoomDetail from 'components/Room/RoomDetailPage/hooks/useRoomDetail';
import { useRouter } from 'next/router';
import styles from './RoomDetailPage.module.scss';

function RoomDetailPage({ id }: { id: string }) {
  const isMobile = useMediaQuery();
  const { roomDetail, roomOptions } = useRoomDetail(id);
  useScrollToTop();
  return (
    <div className={styles.template}>
      <div>{!isMobile && <h1 className={styles.template__title}>복덕방</h1>}</div>
      {roomDetail && (
      <div className={styles.template__name}>
        {roomDetail?.name}
      </div>
      )}
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
        {roomDetail?.image_urls ? <RoomDetailImg imgUrl={roomDetail?.image_urls} />
          : (
            <div className={styles['info__img-slider__img--empty']}>
              <img src="https://static.koreatech.in/assets/ic-room/img.png" alt="이미지 없음" />
            </div>
          )}
      </div>
      <div className={styles.info}>
        <h2 className={styles.info__title}>원룸 옵션</h2>
        {roomDetail && <RoomDetailOption roomOptions={roomOptions} />}
      </div>
      <div className={styles.info}>
        <h2 className={styles.info__title}>원룸 위치</h2>
        {roomDetail
          && (
          <RoomDetailMap
            latitude={roomDetail.latitude}
            longitude={roomDetail.longitude}
            address={roomDetail.address}
          />
          )}
      </div>
    </div>
  );
}

export default function RoomDetailPageWrapper() {
  const router = useRouter();
  const { id } = router.query;
  if (typeof id !== 'string') {
    return null;
  }
  return <RoomDetailPage id={id} />;
}
