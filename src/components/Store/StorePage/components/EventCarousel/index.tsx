import Image from 'next/image';
import { useRouter } from 'next/router';
import LeftBracket from 'assets/svg/left-angle-bracket.svg';
import RightBracket from 'assets/svg/right-angle-bracket.svg';
import Suspense from 'components/ssr/SSRSuspense';
import { useGetAllEvents } from 'components/Store/StorePage/components/hooks/useGetAllEvents';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import { useCarouselController } from './hooks/useCarouselController';
import styles from './EventCarousel.module.scss';

const PLACEHOLDER_IMAGE = 'https://static.koreatech.in/assets/img/rectangle_icon.png';

interface CardProps {
  shop_id: number;
  event_id: number;
  shop_name: string;
  thumbnail_images: string[] | null;
}

function Card({ shop_id, event_id, shop_name, thumbnail_images }: CardProps) {
  const router = useRouter();
  const logger = useLogger();

  const handleClick = () => {
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_categories_event',
      value: `${shop_name}`,
    });
    router.push(`${ROUTES.StoreDetail({ id: String(shop_id) })}?state=이벤트/공지`);
  };

  const hasThumbnail = thumbnail_images && thumbnail_images.length > 0;

  return (
    <button
      type="button"
      key={event_id}
      className={styles['swipe-item']}
      onClick={() => handleClick()}
      disabled={shop_id === 0}
    >
      {hasThumbnail ? (
        <div className={styles['swipe-item__image']}>
          <div className={styles['swipe-item__imageInner']}>
            <Image src={thumbnail_images[0]} alt="가게 이미지" fill />
          </div>
        </div>
      ) : (
        <div className={styles['swipe-item__empty-image']}>
          <Image src={PLACEHOLDER_IMAGE} alt="썸네일 없음" width={90} height={90} />
        </div>
      )}
      <div className={styles['swipe-item__text']}>
        <div>
          <span className={styles['swipe-item__name']}>{shop_name}</span>
          {' 에서'}
        </div>
        <div className={styles['swipe-item__nowrap']}>할인 혜택을 받아보세요!</div>
      </div>
    </button>
  );
}

export default function EventCarousel() {
  const isMobile = useMediaQuery();
  const { events } = useGetAllEvents();
  const { emblaRef, currentIndex, scrollTo } = useCarouselController(isMobile);

  if (events.length < 1) return null;

  const DUMMY_EVENT = {
    shop_id: 0,
    event_id: 0,
    shop_name: '코인',
    thumbnail_images: [PLACEHOLDER_IMAGE],
  };

  const editedEvents = (() => {
    if (isMobile) return events.slice(0, 10);
    if (events.length % 2 === 0) return events;
    return [...events, DUMMY_EVENT];
  })();

  const pageIndicator = `${currentIndex + 1}/${Math.min(10, events.length)}`;

  if (isMobile) {
    return (
      <Suspense fallback={null}>
        <div className={styles.carousel}>
          <div className={styles.container} ref={emblaRef}>
            <div className={styles.swipe}>
              {editedEvents.map((item) => (
                <Card
                  key={item.event_id}
                  shop_id={item.shop_id}
                  event_id={item.event_id}
                  shop_name={item.shop_name}
                  thumbnail_images={item.thumbnail_images}
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
              {pageIndicator}
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
      </Suspense>
    );
  }

  return (
    <Suspense fallback={null}>
      <div className={styles.carousel}>
        <button
          type="button"
          onClick={() => scrollTo('prev')}
          className={styles['carousel-button--prev']}
          aria-label="이전"
        >
          <LeftBracket />
        </button>
        <div className={styles.container} ref={emblaRef}>
          <div className={styles.swipe}>
            {editedEvents.map((item) => (
              <Card
                key={item.event_id}
                shop_id={item.shop_id}
                event_id={item.event_id}
                shop_name={item.shop_name}
                thumbnail_images={item.thumbnail_images}
              />
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => scrollTo('next')}
          className={styles['carousel-button--next']}
          aria-label="다음"
        >
          <RightBracket />
        </button>
      </div>
    </Suspense>
  );
}
