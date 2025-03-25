import { Link } from 'react-router-dom';
import { useGetAllEvents } from 'pages/Store/StorePage/components/hooks/useGetAllEvents';
import useLogger from 'utils/hooks/analytics/useLogger';
import ROUTES from 'static/routes';
import LeftBracket from 'assets/svg/left-angle-bracket.svg';
import RightBracket from 'assets/svg/right-angle-bracket.svg';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import styles from './EventCarousel.module.scss';
import useCarouselController from './hooks/useCarouselController';

interface CardProps {
  shop_id: string;
  event_id: number;
  shop_name: string;
  thumbnail_images: string[];
  onClick: () => void
}

function PCEmptyCard() {
  return (
    (
      <div className={styles['swipe-item']}>
        <div className={styles['swipe-item__empty-image']}>
          <img src="http://static.koreatech.in/assets/img/rectangle_icon.png" alt="썸네일 없음" />
        </div>
        <div className={styles['swipe-item__text']}>
          <div>
            <span className={styles['swipe-item__name']}>
              코인
            </span>
            {' 에서'}
          </div>
          <div className={styles['swipe-item__nowrap']}>할인 혜택을 받아보세요!</div>
        </div>
      </div>
    )
  );
}

function Card({
  shop_id, event_id, shop_name, thumbnail_images, onClick,
}: CardProps) {
  return (
    <Link
      to={`${ROUTES.StoreDetail({ id: shop_id, isLink: true })}?state=이벤트/공지`}
      key={event_id}
      className={styles['swipe-item']}
      onClick={onClick}
    >
      {thumbnail_images && thumbnail_images.length > 0 ? (
        <div className={styles['swipe-item__image']}>
          <img src={thumbnail_images[0]} alt="가게 이미지" />
        </div>
      ) : (
        <div className={styles['swipe-item__empty-image']}>
          <img src="http://static.koreatech.in/assets/img/rectangle_icon.png" alt="썸네일 없음" />
        </div>
      )}
      <div className={styles['swipe-item__text']}>
        <div>
          <span className={styles['swipe-item__name']}>
            {shop_name}
          </span>
          {' 에서'}
        </div>
        <div className={styles['swipe-item__nowrap']}>할인 혜택을 받아보세요!</div>
      </div>
    </Link>
  );
}

export default function EventCarousel() {
  const carouselList = useGetAllEvents();
  const isMobile = useMediaQuery();
  const {
    emblaRef, canNextClick, canPrevClick, currentIndex, scrollTo,
  } = useCarouselController(isMobile);
  const logger = useLogger();
  const eventLogging = (shopName: string) => {
    logger.actionEventClick({
      actionTitle: 'BUSINESS', event_label: 'shop_categories_event', value: `${shopName}`, event_category: 'click',
    });
  };

  if (!carouselList) return null;
  if (carouselList.length < 1) return null;

  if (isMobile) {
    return (
      <div className={styles.carousel}>
        <div className={styles.container} ref={emblaRef}>
          <div className={styles.swipe}>
            {carouselList.slice(0, 10).map((item) => (
              <Card
                shop_id={String(item.shop_id)}
                event_id={item.event_id}
                shop_name={item.shop_name}
                thumbnail_images={item.thumbnail_images}
                onClick={() => eventLogging(item.shop_name)}
              />
            ))}
          </div>
          <div className={styles.pagination}>
            <button
              type="button"
              onClick={() => scrollTo('prev')}
              className={styles['pagination-button--prev']}
              aria-label="이전"
            >
              <LeftBracket />
            </button>
            {currentIndex + 1}
            /
            {carouselList.length > 10 ? 10 : carouselList.length}
            <button
              type="button"
              onClick={() => scrollTo('next')}
              className={styles['pagination-button--next']}
              aria-label="다음"
            >
              <RightBracket />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.carousel}>
      {
        canPrevClick && (
          <button
            type="button"
            onClick={() => scrollTo('prev')}
            className={styles['carousel-button--prev']}
            aria-label="이전"
          >
            <LeftBracket />
          </button>
        )
      }
      <div className={styles.container} ref={emblaRef}>
        <div className={styles.swipe}>
          {carouselList.map((item) => (
            <Card
              key={item.event_id}
              shop_id={String(item.shop_id)}
              event_id={item.event_id}
              shop_name={item.shop_name}
              thumbnail_images={item.thumbnail_images}
              onClick={() => eventLogging(item.shop_name)}
            />
          ))}
          {carouselList.length % 2 !== 0 && <PCEmptyCard />}
        </div>
      </div>
      {canNextClick && (
        <button
          type="button"
          onClick={() => scrollTo('next')}
          className={styles['carousel-button--next']}
          aria-label="다음"
        >
          <RightBracket />
        </button>
      )}
    </div>
  );
}
