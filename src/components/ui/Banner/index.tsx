import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useLogger from 'utils/hooks/analytics/useLogger';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import ArrowIcon from 'assets/svg/previous-arrow-icon.svg';
import { setCookie, getCookie } from 'utils/ts/cookie';
import useBanners from './hooks/useBanners';
import styles from './Banner.module.scss';

interface BannerProps {
  categoryName: string;
  categoryId: number;
}

const HIDE_BANNER_DURATION_DAYS = 7;

function Banner({ categoryName, categoryId }: BannerProps) {
  const logger = useLogger();
  const [isModalOpen, , closeModal] = useBooleanState((
    getCookie('HIDE_BANNER') !== categoryName
    && sessionStorage.getItem('CLOSE_BANNER') !== categoryName
  ));
  const { data: bannersData } = useBanners(categoryId);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const currentBanner = bannersData.banners[currentPageIndex];

  const handleImageLinkClick = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'main_modal',
      value: `${currentBanner.title}`,
    });
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'main_modal',
      value: 'design_A',
      event_category: 'a/b test 로깅(메인 모달)',
    }); // AB test용 로깅 (추후 삭제)
  };

  const handelPrevButtonClick = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'main_modal_next_modal',
      value: `${currentBanner.title}`,
    });
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'main_modal_next_modal',
      value: 'design_A',
      event_category: 'a/b test 로깅(메인 모달)',
    }); // AB test용 로깅 (추후 삭제)
    setCurrentPageIndex((prev) => (prev === 0 ? bannersData.count - 1 : prev - 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const handelNextButtonClick = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'main_next_modal',
      value: `${currentBanner.title}`,
    });
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'main_next_modal',
      value: 'design_A',
      event_category: 'a/b test 로깅(메인 모달)',
    }); // AB test용 로깅 (추후 삭제)
    setCurrentPageIndex((prev) => (prev === bannersData.count - 1 ? 0 : prev + 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const handleCloseBanner = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'main_modal_close',
      value: `${currentBanner.title}`,
    });
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'main_modal_close',
      value: 'design_A',
      event_category: 'a/b test 로깅(메인 모달)',
    }); // AB test용 로깅 (추후 삭제)
    sessionStorage.setItem('CLOSE_BANNER', categoryName);
    closeModal();
  };

  const handleHideForWeek = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'main_modal_hide_7d',
      value: `${currentBanner.title}`,
    });
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'main_modal_hide_7d',
      value: 'design_A',
      event_category: 'a/b test 로깅(메인 모달)',
    }); // AB test용 로깅 (추후 삭제)
    setCookie('HIDE_BANNER', categoryName, HIDE_BANNER_DURATION_DAYS);
    closeModal();
  };

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
        event_label: 'main_modal_entry',
        value: 'design_A',
        event_category: 'a/b test 로깅(메인 모달)',
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  return (
    <div className={styles.container}>
      <div className={styles.slider}>
        <Link
          to={currentBanner.redirect_link ?? ''}
          onClick={handleImageLinkClick}
        >
          <img
            src={currentBanner.image_url}
            alt="banner"
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/400.jpg?text=Coming+soon...';
            }}
            className={styles.slider__image}
          />
        </Link>
        <div className={styles.slider__pagination}>
          <p className={styles['slider__pagination-label']}>
            {currentPageIndex + 1}
            /
            {bannersData.count}
          </p>
        </div>
        <button
          type="button"
          className={`${styles.slider__arrow} ${styles['slider__arrow--previous']}`}
          aria-label="이전 슬라이드"
          onClick={handelPrevButtonClick}
        >
          <ArrowIcon />
        </button>
        <button
          type="button"
          className={`${styles.slider__arrow} ${styles['slider__arrow--next']}`}
          aria-label="다음 슬라이드"
          onClick={handelNextButtonClick}
        >
          <ArrowIcon />
        </button>
      </div>
      <div className={styles.footer}>
        <button
          type="button"
          className={styles['footer__button--hide']}
          onClick={handleHideForWeek}
        >
          일주일 동안 그만 보기
        </button>
        <button
          type="button"
          className={styles['footer__button--close']}
          onClick={handleCloseBanner}
        >
          닫기
        </button>
      </div>
    </div>
  );
}

export default Banner;
