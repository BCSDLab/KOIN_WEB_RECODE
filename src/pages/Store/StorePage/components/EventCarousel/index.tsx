import { Link } from 'react-router-dom';
import { useGetAllEvents } from 'pages/Store/StorePage/components/hooks/useGetAllEvents';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import useLogger from 'utils/hooks/analytics/useLogger';
import ROUTES from 'static/routes';
import styles from './EventCarousel.module.scss';

export default function EventCarousel() {
  const carouselList = useGetAllEvents();
  const [emblaRef] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ stopOnInteraction: false, delay: 2000 })],
  );
  const logger = useLogger();

  const eventLogging = (shopName: string) => {
    logger.actionEventClick({
      actionTitle: 'BUSINESS', title: 'shop_categories_event', value: `${shopName}`, event_category: 'click',
    });
  };

  return (
    <div>
      {carouselList && carouselList.length > 0 ? (
        <div className={styles.container} ref={emblaRef}>
          <div className={styles.swipe}>
            {carouselList.map((item) => (
              <Link
                to={ROUTES.StoreDetail.general(item.shop_id)}
                key={item.event_id}
                className={styles['swipe-item']}
                onClick={() => eventLogging(item.shop_name)}
              >
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
      ) : null}
    </div>
  );
}
