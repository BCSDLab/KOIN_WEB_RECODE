import { useState, useEffect } from 'react';
import { useGetAllEvents } from 'pages/Store/StorePage/components/hooks/useGetAllEvents';
import { useNavigate } from 'react-router-dom';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import styles from './EventCarousel.module.scss';

const SLIDE_WIDTH = 387; // width + gap

export default function EventCarousel() {
  const isMobile = useMediaQuery();
  const carouselList = useGetAllEvents();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const slideTime = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex === carouselList!.length - 1
        ? 0 : prevIndex + 1));
    }, 3000);

    return () => {
      clearInterval(slideTime);
    };
  }, [carouselList, currentIndex]);

  const transfromValue = isMobile ? `translateX(-${100 * currentIndex}vw)` : `translateX(-${SLIDE_WIDTH * currentIndex}px)`;

  return (
    <div className={styles.container}>
      {carouselList && carouselList.map((item) => (
        <button
          type="button"
          className={styles['swipe-item']}
          style={{ transform: transfromValue }}
          onClick={() => navigate(`/store/${item.shop_id}`)}
        >
          {item.thumbnail_images.length > 0 ? (
            <div className={styles['swipe-item__image']}>
              <img src={item.thumbnail_images[0]} alt="가게 이미지" />
            </div>
          ) : (
            <div className={styles['swipe-item__empty-image']}>
              <img src="http://static.koreatech.in/assets/img/rectangle_icon.png" alt="썸네일 없음" />
            </div>
          ) }
          <div className={styles['swipe-item__text']}>
            <div>
              <span className={styles['swipe-item__name']}>
                {item.shop_name}
              </span>
              {' 에서'}
            </div>
            <div className={styles['swipe-item__nowrap']}>할인 혜택을 받아보세요!</div>
          </div>
        </button>
      ))}
    </div>
  );
}
