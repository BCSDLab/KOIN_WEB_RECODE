import { Link } from 'react-router-dom';
import { useGetAllEvents } from 'pages/Store/StorePage/components/hooks/useGetAllEvents';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import styles from './EventCarousel.module.scss';

export default function EventCarousel() {
  const carouselList = useGetAllEvents();
  const [emblaRef] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ stopOnInteraction: false, delay: 2000 })],
  );

  return (
    <div className={styles.container} ref={emblaRef}>
      <div className={styles.swipe}>
        {carouselList && carouselList.map((item) => (
          <Link to={`${item.shop_id}`} key={item.shop_id} className={styles['swipe-item']}>
            {item.thumbnail_images.length > 0 ? (
              <div className={styles['swipe-item__image']}>
                <img src={item.thumbnail_images[0]} alt="가게 이미지" />
              </div>
            ) : (
              <div className={styles['swipe-item__empty-image']}>
                <img src="http://static.koreatech.in/assets/img/rectangle_icon.png" alt="썸네일 없음" />
              </div>
            )}
            <div className={styles['swipe-item__text']}>
              <div>
                <span className={styles['swipe-item__name']}>
                  {item.shop_name}
                </span>
                {' 에서'}
              </div>
              <div className={styles['swipe-item__nowrap']}>할인 혜택을 받아보세요!</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
