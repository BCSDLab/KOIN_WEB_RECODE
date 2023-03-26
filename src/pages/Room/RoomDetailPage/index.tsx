import { useParams } from 'react-router-dom';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import useClickArrow from './hooks/useClickArrow';
import useRoomDetail from './hooks/useRoomDetail';
import styles from './RoomDetailPage.module.scss';

function RoomDetailPage() {
  const isMobile = useMediaQuery();
  const params = useParams();
  const roomDetail = useRoomDetail(params.id);
  const { imgIndx, clickRightArrow, clickLeftArrow } = useClickArrow();
  return (
    <div className={styles.template}>
      <div>{!isMobile && <h1 className={styles.title}>복덕방</h1>}</div>
      <div className={styles.name}>
        {roomDetail?.name}
      </div>
      <div className={styles.info}>
        <h2 className={styles.info__title}>원룸 정보</h2>
        <table className={styles.table}>
          <tbody>
            <tr>
              <th className={styles.table__title}>월세</th>
              <td className={styles.table__cell}>{roomDetail?.monthly_fee ? roomDetail?.monthly_fee : ' - ' }</td>
              <th className={styles.table__title}>방 종류</th>
              <td className={styles.table__cell}>{roomDetail?.room_type ? roomDetail?.room_type : ' - '}</td>
            </tr>
            <tr className={styles.table__row}>
              <th className={styles.table__title}>전세</th>
              <td className={styles.table__cell}>{roomDetail?.charter_fee ? `${roomDetail?.charter_fee}만원` : ' - '}</td>
              <th className={styles.table__title}>보증금</th>
              <td className={styles.table__cell}>{roomDetail?.deposit ? `${roomDetail?.deposit}만원` : ' - '}</td>
            </tr>
            <tr className={styles.table__row}>
              <th className={styles.table__title}>층수</th>
              <td className={styles.table__cell}>{roomDetail?.floor ? `${roomDetail?.floor}층` : ' - '}</td>
              <th className={styles.table__title}>관리비</th>
              <td className={styles.table__cell}>{roomDetail?.management_fee ? roomDetail?.management_fee : ' - '}</td>
            </tr>
            <tr className={styles.table__row}>
              <th className={styles.table__title}>방 크기</th>
              <td className={styles.table__cell}>{roomDetail?.size ? `${roomDetail?.size}평` : ' - '}</td>
              <th className={styles.table__title}>연락처</th>
              <td className={styles.table__cell}>{roomDetail?.phone ? roomDetail?.phone : ' - '}</td>
            </tr>
          </tbody>
        </table>
        {roomDetail?.image_urls ? (
          <div className={styles['img-slider']}>
            <button className={styles['img-slider__img-arrow']} type="button" onClick={clickLeftArrow}>
              <img src="https://static.koreatech.in/assets/ic-room/left-arrow.png" alt="이전 화살표" />
            </button>
            <div className={styles['img-slider__img']}>
              <img src={roomDetail?.image_urls[imgIndx]} alt="방 사진" />
            </div>
            <button
              className={styles['img-slider__img-arrow']}
              type="button"
              onClick={() => clickRightArrow(roomDetail?.image_urls?.length)}
            >
              <img
                src="https://static.koreatech.in/assets/ic-room/right-arrow.png"
                alt="이후 화살표"
              />
            </button>
            <div className={styles['img-slider__indx']}>
              {imgIndx + 1}
              {' '}
              /
              {' '}
              {roomDetail?.image_urls.length}
            </div>
          </div>
        )
          : (
            <div className={styles['info__no-img']}>
              <img src="https://static.koreatech.in/assets/ic-room/img.png" alt="이미지 없음" />
            </div>
          )}
      </div>
    </div>
  );
}

export default RoomDetailPage;
