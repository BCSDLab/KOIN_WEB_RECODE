import { useState, useEffect } from 'react';
import { ReactComponent as EmptyImageIcon } from 'assets/svg/empty-thumbnail.svg';
import { useGetAllEvents } from 'pages/Store/StorePage/components/hooks/useGetAllEvents';
import { useNavigate } from 'react-router-dom';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import styles from './EventCarousel.module.scss';

const colors = ['#6DBBDD', '#4590BB', '#175C8E', '#10477A'];

export default function EventCarousel() {
  const isMobile = useMediaQuery();
  const carouselList = useGetAllEvents();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideWidth = isMobile ? 266 : 387; // width + gap

  useEffect(() => {
    const slideTime = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex === carouselList!.length - 1
        ? 0 : prevIndex + 1));
    }, 3000);

    return () => {
      clearInterval(slideTime);
    };
  }, [carouselList, currentIndex]);

  return (
    <div className={styles.container}>
      {carouselList && carouselList.map((item, idx) => (
        <div key={item.content}>
          <button
            type="button"
            className={styles['swipe-item']}
            style={{ backgroundColor: `${colors[Math.abs(((idx + 1) % 4) - 2)]}`, transform: `translateX(-${slideWidth * currentIndex}px)` }}
            onClick={() => navigate(`/store/${item.shop_id}`)}
          >
            {item.thumbnail_images.length > 0 ? (
              <img
                src={item.thumbnail_images[0]}
                alt="가게 이미지"
                className={styles['swipe-item__image']}
              />
            ) : (
              <div className={styles['swipe-item__empty-image']}>
                <EmptyImageIcon />
              </div>
            ) }
            <div className={styles['swipe-item__text']}>
              <div style={{ textAlign: 'start' }}>
                <span className={styles['swipe-item__name']}>
                  {item.title}
                </span>
                {' 에서'}
              </div>
              <div className={styles['swipe-item__nowrap']}>할인 혜택을 받아보세요!</div>
            </div>
          </button>
        </div>
      ))}
    </div>
  );
}
