import useClickArrow from 'pages/Room/RoomDetailPage/hooks/useClickArrow';
import styles from './RoomDetailImg.module.scss';

interface ImgProps {
  imgUrl: string[] | null;
}

function RoomDetailImg({ imgUrl }: ImgProps) {
  const { imgIndex, clickRightArrow, clickLeftArrow } = useClickArrow();
  return (
    <div>
      {imgUrl ? (
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
            onClick={() => clickRightArrow(imgUrl.length)}
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
      )
        : (
          <div className={styles['img-slider__img--empty']}>
            <img src="https://static.koreatech.in/assets/ic-room/img.png" alt="이미지 없음" />
          </div>
        )}
    </div>
  );
}

export default RoomDetailImg;
