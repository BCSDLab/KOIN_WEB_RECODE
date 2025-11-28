import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BannersResponse } from 'api/banner/entity';
import ArrowIcon from 'assets/svg/previous-arrow-icon.svg';
import { useSwipeable } from 'react-swipeable';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { setCookie } from 'utils/ts/cookie';
import styles from './Banner.module.scss';

interface BannerCardProps {
  handleImageLinkClick: () => void;
  image_url: string;
  redirect_link: string | null;
  isFirst: boolean;
}

function BannerCard({ handleImageLinkClick, image_url, redirect_link, isFirst }: BannerCardProps) {
  const imgWrapper = (
    <div className={styles.slider__imageWrapper}>
      <Image
        src={image_url}
        alt="banner"
        fill
        priority={isFirst}
        fetchPriority={isFirst ? 'high' : 'auto'}
        sizes="(max-width: 768px) 100vw, 400px"
        className={styles.slider__image}
        onError={(e) => {
          e.currentTarget.src = 'https://placehold.co/400.jpg?text=Coming+soon...';
        }}
      />
    </div>
  );

  if (redirect_link) {
    return (
      <Link href={redirect_link} onClick={handleImageLinkClick} className={styles.slider__imageOuter}>
        {imgWrapper}
      </Link>
    );
  }

  return (
    <div
      className={styles.slider__imageOuter}
      role="button"
      tabIndex={0}
      onClick={handleImageLinkClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleImageLinkClick();
        }
      }}
    >
      {imgWrapper}
    </div>
  );
}

interface BannerProps {
  bannersList: BannersResponse;
  bannerCategoryId: number;
  isBannerOpen: boolean;
}

const HIDE_BANNER_DURATION_DAYS = 7;

function Banner({ bannersList, bannerCategoryId, isBannerOpen }: BannerProps) {
  const isMobile = useMediaQuery();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const logger = useLogger();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const currentBanner = bannersList.banners[currentPageIndex];
  const [isModalOpen, , closeModal] = useBooleanState(isBannerOpen);

  const resetAutoSlide = useCallback(() => {
    if (intervalRef.current) clearTimeout(intervalRef.current);

    intervalRef.current = setTimeout(() => {
      setCurrentPageIndex((prev) => (prev === bannersList.count - 1 ? 0 : prev + 1));
    }, 3000);
  }, [bannersList.count]);

  const handleImageLinkClick = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'main_modal',
      value: `${currentBanner.title}`,
    });
  };

  const handlePrevButtonClick = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'main_next_modal',
      value: `${currentBanner.title}`,
    });
    setCurrentPageIndex((prev) => (prev === 0 ? bannersList.count - 1 : prev - 1));
    resetAutoSlide();
  };

  const handleNextButtonClick = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'main_next_modal',
      value: `${currentBanner.title}`,
    });
    setCurrentPageIndex((prev) => (prev === bannersList.count - 1 ? 0 : prev + 1));
    resetAutoSlide();
  };

  const handleCloseBanner = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'main_modal_close',
      value: `${currentBanner.title}`,
    });
    closeModal();
  };

  const handleHideForWeek = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'main_modal_hide_7d',
      value: `${currentBanner.title}`,
    });
    if (bannerCategoryId === 1) {
      setCookie('HIDE_BANNER', `modal_category_${bannerCategoryId}`, HIDE_BANNER_DURATION_DAYS);
    }
    closeModal();
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNextButtonClick,
    onSwipedRight: handlePrevButtonClick,
    trackMouse: true,
  });

  useEffect(() => {
    if (!isModalOpen || bannersList.count <= 1) return undefined;

    resetAutoSlide();

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isModalOpen, bannersList.count, resetAutoSlide, currentPageIndex]);

  useEffect(() => {
    if (isModalOpen) {
      logger.actionEventLoad({
        team: 'CAMPUS',
        event_label: 'main_modal_entry',
        value: `${currentBanner.title}`,
        event_category: 'entry',
      });
      logger.actionEventLoad({
        team: 'CAMPUS',
        event_label: 'CAMPUS_modal_1',
        value: 'design_A',
        event_category: 'a/b test 로깅(메인 모달)',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <div {...(isMobile ? swipeHandlers : {})} className={styles.slider}>
          <BannerCard
            handleImageLinkClick={handleImageLinkClick}
            image_url={currentBanner.image_url}
            redirect_link={currentBanner.redirect_link}
            isFirst={currentPageIndex === 0}
          />
          <div className={styles.slider__pagination}>
            <p className={styles['slider__pagination-label']}>
              {currentPageIndex + 1}/{bannersList.count}
            </p>
          </div>
          <button
            type="button"
            className={`${styles.slider__arrow} ${styles['slider__arrow--previous']}`}
            aria-label="이전 슬라이드"
            onClick={handlePrevButtonClick}
          >
            <ArrowIcon />
          </button>
          <button
            type="button"
            className={`${styles.slider__arrow} ${styles['slider__arrow--next']}`}
            aria-label="다음 슬라이드"
            onClick={handleNextButtonClick}
          >
            <ArrowIcon />
          </button>
        </div>
        <div className={styles.footer}>
          <button type="button" className={styles['footer__button--hide']} onClick={handleHideForWeek}>
            일주일 동안 그만 보기
          </button>
          <button type="button" className={styles['footer__button--close']} onClick={handleCloseBanner}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

export default Banner;
