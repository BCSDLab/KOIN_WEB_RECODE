import Image from 'next/image';
import useClickArrow from 'components/Room/RoomDetailPage/hooks/useClickArrow';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import styles from './RoomDetailImg.module.scss';

interface RoomDetailImgProps {
  imgUrl: string[];
}

function RoomDetailImg({ imgUrl }: RoomDetailImgProps) {
  const isMobile = useMediaQuery();
  const { imgIndex, clickRightArrow, clickLeftArrow } = useClickArrow(imgUrl.length);

  return (
    <div className={styles['img-slider']}>
      <button className={styles['img-slider__img-arrow']} type="button" onClick={clickLeftArrow}>
        <Image
          src="https://static.koreatech.in/assets/ic-room/left-arrow.png"
          alt=""
          width={isMobile ? 40 : 48}
          height={isMobile ? 40 : 48}
          sizes="48px"
        />
      </button>
      <div className={styles['img-slider__img']}>
        <Image
          key={imgUrl[imgIndex]}
          src={imgUrl[imgIndex]}
          alt="방 사진"
          fill
          sizes={isMobile ? '100vw' : '800px'}
          style={{ objectFit: 'cover' }}
          priority={imgIndex === 0}
        />
      </div>
      <button className={styles['img-slider__img-arrow']} type="button" onClick={() => clickRightArrow()}>
        <Image
          src="https://static.koreatech.in/assets/ic-room/right-arrow.png"
          alt=""
          width={isMobile ? 40 : 48}
          height={isMobile ? 40 : 48}
          sizes="48px"
        />
      </button>
      <div className={styles['img-slider__index']}>{`${imgIndex + 1} / ${imgUrl.length}`}</div>
    </div>
  );
}

export default RoomDetailImg;
