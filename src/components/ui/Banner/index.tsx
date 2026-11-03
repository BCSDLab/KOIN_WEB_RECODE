import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@bcsdlab/utils';
import type { BannersResponse } from 'api/banner/entity';
import ArrowRightIcon from 'assets/svg/common/arrow-right-icon.svg';
import ArrowIcon from 'assets/svg/previous-arrow-icon.svg';
import { useSwipeable } from 'react-swipeable';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { getCookie, setCookie } from 'utils/ts/cookie';

import styles from './Banner.module.scss';

interface BannerCardProps {
  handleImageLinkClick: () => void;
  image_url: string;
  redirect_link: string | null;
  isFirst: boolean;
  sizes?: string;
}

function BannerCard({
  handleImageLinkClick,
  image_url,
  redirect_link,
  isFirst,
  sizes = '(max-width: 768px) 100vw, 400px',
}: BannerCardProps) {
  const imgWrapper = (
    <div className={styles['slider__image-wrapper']}>
      <Image
        src={image_url}
        alt="banner"
        fill
        priority={isFirst}
        fetchPriority={isFirst ? 'high' : 'auto'}
        sizes={sizes}
        className={styles.slider__image}
        onError={(e) => {
          e.currentTarget.src = 'https://placehold.co/400.jpg?text=Coming+soon...';
        }}
      />
    </div>
  );

  if (redirect_link) {
    return (
      <Link href={redirect_link} onClick={handleImageLinkClick} className={styles['slider__image-outer']}>
        {imgWrapper}
      </Link>
    );
  }

  return (
    <div
      className={styles['slider__image-outer']}
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
  variant?: 'inline';
}

const HIDE_BANNER_DURATION_DAYS = 7;
const HIDE_BANNER_COOKIE = 'HIDE_BANNER';

function Banner({ bannersList, bannerCategoryId, variant }: BannerProps) {
  const isMobile = useMediaQuery();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const logger = useLogger();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const currentBanner = bannersList.banners[currentPageIndex];
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);
  const isVisible = variant === 'inline' ? bannersList.count > 0 : isModalOpen;

  useEffect(() => {
    if (variant === 'inline') return;

    if (bannersList.count === 0) {
      closeModal();

      return;
    }

    // 배너 노출 여부를 SSR에서 분리해 페이지 HTML 캐시를 안전하게 유지
    const isBannerHidden = getCookie(HIDE_BANNER_COOKIE) === `modal_category_${bannerCategoryId}`;
    if (isBannerHidden) {
      closeModal();

      return;
    }

    openModal();
  }, [bannerCategoryId, bannersList.count, closeModal, openModal, variant]);

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

  const handlePageButtonClick = (index: number) => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'main_next_modal',
      value: `${currentBanner.title}`,
    });
    setCurrentPageIndex(index);
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
      setCookie(HIDE_BANNER_COOKIE, `modal_category_${bannerCategoryId}`, HIDE_BANNER_DURATION_DAYS);
    }
    closeModal();
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNextButtonClick,
    onSwipedRight: handlePrevButtonClick,
    trackMouse: true,
  });

  useEffect(() => {
    if (!isVisible || bannersList.count <= 1) return undefined;

    resetAutoSlide();

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isVisible, bannersList.count, resetAutoSlide, currentPageIndex]);

  useEffect(() => {
    if (isVisible) {
      logger.actionEventLoad({
        team: 'CAMPUS',
        event_label: 'main_modal_entry',
        value: `${currentBanner.title}`,
        event_category: 'entry',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 배너가 보일 때만 로깅해야 하므로 logger/currentBanner 변경은 무시
  }, [isVisible]);

  if (!isVisible) return null;

  if (variant === 'inline') {
    return (
      <section className={styles.inline} aria-label="메인 배너">
        <div className={styles.inline__slider}>
          <BannerCard
            handleImageLinkClick={handleImageLinkClick}
            image_url={currentBanner.image_url}
            redirect_link={currentBanner.redirect_link}
            isFirst={currentPageIndex === 0}
            sizes="357px"
          />
          {bannersList.count > 1 && (
            <>
              <button
                type="button"
                className={`${styles.inline__arrow} ${styles['inline__arrow--previous']}`}
                aria-label="이전 슬라이드"
                onClick={handlePrevButtonClick}
              >
                <ArrowRightIcon aria-hidden />
              </button>
              <button
                type="button"
                className={`${styles.inline__arrow} ${styles['inline__arrow--next']}`}
                aria-label="다음 슬라이드"
                onClick={handleNextButtonClick}
              >
                <ArrowRightIcon aria-hidden />
              </button>
            </>
          )}
        </div>
        {bannersList.count > 1 && (
          <div className={styles.inline__pagination}>
            {bannersList.banners.map((banner, index) => (
              <button
                key={banner.id}
                type="button"
                className={cn({
                  [styles.inline__indicator]: true,
                  [styles['inline__indicator--active']]: index === currentPageIndex,
                })}
                aria-label={`${index + 1}번 배너 보기`}
                aria-current={index === currentPageIndex ? 'true' : undefined}
                onClick={() => handlePageButtonClick(index)}
              />
            ))}
          </div>
        )}
      </section>
    );
  }

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
