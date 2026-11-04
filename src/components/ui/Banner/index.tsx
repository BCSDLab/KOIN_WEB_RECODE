import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@bcsdlab/utils';
import type { BannersResponse } from 'api/banner/entity';
import ArrowRightIcon from 'assets/svg/common/arrow-right-icon.svg';
import useLogger from 'utils/hooks/analytics/useLogger';

import styles from './Banner.module.scss';

interface BannerCardProps {
  handleImageLinkClick: () => void;
  image_url: string;
  redirect_link: string | null;
  isFirst: boolean;
}

function BannerCard({ handleImageLinkClick, image_url, redirect_link, isFirst }: BannerCardProps) {
  const imgWrapper = (
    <div className={styles['slider__image-wrapper']}>
      <Image
        src={image_url}
        alt="banner"
        fill
        priority={isFirst}
        fetchPriority={isFirst ? 'high' : 'auto'}
        sizes="357px"
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
}

function Banner({ bannersList }: BannerProps) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isFocusedRef = useRef(false);
  const logger = useLogger();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const currentBanner = bannersList.banners[currentPageIndex];
  const isVisible = bannersList.count > 0;

  const resetAutoSlide = useCallback(() => {
    if (intervalRef.current) clearTimeout(intervalRef.current);
    if (isFocusedRef.current) return;

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

  return (
    <section
      className={styles.inline}
      aria-label="메인 배너"
      onFocus={() => {
        isFocusedRef.current = true;
        if (intervalRef.current) clearTimeout(intervalRef.current);
      }}
      onBlur={(event) => {
        if (event.currentTarget.contains(event.relatedTarget)) return;

        isFocusedRef.current = false;
        if (bannersList.count > 1) resetAutoSlide();
      }}
    >
      <div className={styles.inline__slider}>
        <BannerCard
          handleImageLinkClick={handleImageLinkClick}
          image_url={currentBanner.image_url}
          redirect_link={currentBanner.redirect_link}
          isFirst={currentPageIndex === 0}
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

export default Banner;
