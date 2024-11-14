import { Link } from 'react-router-dom';
import { useGetAllEvents } from 'pages/Store/StorePage/components/hooks/useGetAllEvents';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import useLogger from 'utils/hooks/analytics/useLogger';
import ROUTES from 'static/routes';
import {
  useCallback, useEffect, useState,
} from 'react';
import ArrowLeft from 'assets/svg/left-angle-bracket.svg';
import RightBracket from 'assets/svg/right-angle-bracket.svg';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import styles from './EventCarousel.module.scss';

interface WrapperProps {
  children: React.ReactNode;
}

function EventCarouselWrapper({ children }: WrapperProps) {
  const carouselList = useGetAllEvents();
  const isMobile = useMediaQuery();
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      slidesToScroll: isMobile ? 1 : 2,
    },
    [Autoplay(
      {
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        delay: 4000,
      },
    )],
  );
  const [canPrevClick, setCanPrevClick] = useState(false);
  const [canNextClick, setCanNextClick] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(1);
  const updateIndex = useCallback(() => {
    if (emblaApi) {
      setCurrentIndex(emblaApi.selectedScrollSnap());
    }
  }, [emblaApi]);
  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
    }
  }, [emblaApi]);
  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
    }
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setCanPrevClick(emblaApi.canScrollPrev());
    setCanNextClick(emblaApi.canScrollNext());
    emblaApi.on('slidesInView', updateIndex);
    // eslint-disable-next-line
    return () => { // 클린업 함수 사용을 위해 off
      emblaApi.off('slidesInView', updateIndex);
    };
  }, [emblaApi, updateIndex]);

  return (
    <div className={styles.carousel}>
      {
        !isMobile && canPrevClick && (
          // eslint-disable-next-line
          <button
            type="button"
            onClick={scrollPrev}
            className={styles['carousel-button--prev']}
          >
            <ArrowLeft />
          </button>
        )
      }
      {carouselList && carouselList.length > 0 ? (
        <div className={styles.container} ref={emblaRef}>
          {children}
        </div>
      ) : null}
      {
        !isMobile && canNextClick && (
          // eslint-disable-next-line
          <button
            type="button"
            onClick={scrollNext}
            className={styles['carousel-button--next']}
          >
            <RightBracket />
          </button>
        )
      }
      {
        carouselList && isMobile && (
          <div className={styles.pagination}>
            { // eslint-disable-next-line
              <button
                type="button"
                onClick={scrollPrev}
                className={styles['pagination-button--prev']}
              >
                <ArrowLeft />
              </button>
            }
            {currentIndex + 1}
            /
            {carouselList.length > 10 ? 10 : carouselList.length}
            { // eslint-disable-next-line
            <button
              type="button"
              onClick={scrollNext}
              className={styles['pagination-button--next']}
            >
              <RightBracket />
            </button>
            }
          </div>
        )
      }
    </div>
  );
}

function EventCarousel() {
  const carouselList = useGetAllEvents();
  const isMobile = useMediaQuery();
  const logger = useLogger();
  const eventLogging = (shopName: string) => {
    logger.actionEventClick({
      actionTitle: 'BUSINESS', title: 'shop_categories_event', value: `${shopName}`, event_category: 'click',
    });
  };

  if (!carouselList) return null;

  const targetList = carouselList.length > 10 ? carouselList?.slice(0, 10) : carouselList;

  return (
    <div className={styles.swipe}>
      {targetList && targetList.map((item) => (
        <Link
          to={`${ROUTES.StoreDetail({ id: String(item.shop_id), isLink: true })}?state=이벤트/공지`}
          key={item.event_id}
          className={styles['swipe-item']}
          onClick={() => eventLogging(item.shop_name)}
        >
          {item.thumbnail_images && item.thumbnail_images.length > 0 ? (
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
      { // pc 환경에서 이벤트 개수가 홀수면 빈 이미지 추가
            !isMobile && targetList && targetList.length % 2 !== 0 && (
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
      }
    </div>
  );
}

export default function EventBanner() {
  return (
    <EventCarouselWrapper>
      <EventCarousel />
    </EventCarouselWrapper>
  );
}
