import useClickArrow from 'pages/Room/RoomDetailPage/hooks/useClickArrow';
import styles from './RoomDetailImg.module.scss';

interface RoomDetailImgProps {
  imgUrl: string[];
}

function RoomDetailImg({ imgUrl }: RoomDetailImgProps) {
  const { imgIndex, clickRightArrow, clickLeftArrow } = useClickArrow(imgUrl.length);
  return (
    <div className={styles['img-slider']}>
      <button className={styles['img-slider__img-arrow']} type="button" onClick={clickLeftArrow}>
        <img src="https://static.koreatech.in/assets/ic-room/left-arrow.png" alt="이전 이미지 보기" />
      </button>
      <div className={styles['img-slider__img']}>
        <img src={imgUrl[imgIndex]} alt="방 사진" />
      </div>
      <button
        className={styles['img-slider__img-arrow']}
        type="button"
        onClick={() => clickRightArrow()}
      >
        <img
          src="https://static.koreatech.in/assets/ic-room/right-arrow.png"
          alt="이후 이미지 보기"
        />
      </button>
      <div className={styles['img-slider__index']}>
        {`${imgIndex + 1} / ${imgUrl.length}`}
      </div>
    </div>
  );
}

export default RoomDetailImg;
