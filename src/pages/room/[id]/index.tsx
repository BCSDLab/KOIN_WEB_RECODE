import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Image from 'next/image';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { room } from 'api';
import { SSRLayout } from 'components/layout';
import RoomDetailImg from 'components/Room/components/RoomDetailImg';
import RoomDetailMap from 'components/Room/components/RoomDetailMap';
import RoomDetailOption from 'components/Room/components/RoomDetailOption';
import RoomDetailTable from 'components/Room/components/RoomDetailTable';
import useRoomDetail from 'components/Room/RoomDetailPage/hooks/useRoomDetail';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import { parseQueryString, parseServerSideParams } from 'utils/ts/parseServerSideParams';
import styles from './RoomDetailPage.module.scss';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { query } = parseServerSideParams(context);
  const id = parseQueryString(query.id);

  if (!id) {
    return {
      notFound: true,
    };
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['roomDetail', id],
    queryFn: () => room.getRoomDetailInfo(id),
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      id,
    },
  };
};

function RoomDetailPage({ id }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const isMobile = useMediaQuery();
  const { roomDetail, roomOptions } = useRoomDetail(id);
  useScrollToTop();

  return (
    <div className={styles.template}>
      <div>{!isMobile && <h1 className={styles.template__title}>복덕방</h1>}</div>
      {roomDetail && <div className={styles.template__name}>{roomDetail?.name}</div>}
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
        {roomDetail?.image_urls ? (
          <RoomDetailImg imgUrl={roomDetail?.image_urls} />
        ) : (
          <div className={styles['info__img-slider__img--empty']}>
            <Image
              src="https://static.koreatech.in/assets/ic-room/img.png"
              alt="이미지 없음"
              width={712}
              height={402}
            />
          </div>
        )}
      </div>
      <div className={styles.info}>
        <h2 className={styles.info__title}>원룸 옵션</h2>
        {roomDetail && <RoomDetailOption roomOptions={roomOptions} />}
      </div>
      <div className={styles.info}>
        <h2 className={styles.info__title}>원룸 위치</h2>
        {roomDetail && (
          <RoomDetailMap latitude={roomDetail.latitude} longitude={roomDetail.longitude} address={roomDetail.address} />
        )}
      </div>
    </div>
  );
}

export default RoomDetailPage;

RoomDetailPage.getLayout = (page: React.ReactElement) => <SSRLayout>{page}</SSRLayout>;
