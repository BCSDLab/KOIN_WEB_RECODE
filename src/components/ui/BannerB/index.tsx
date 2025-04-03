import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useLogger from 'utils/hooks/analytics/useLogger';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import ArrowIcon from 'assets/svg/previous-arrow-icon.svg';
import { setCookie, getCookie } from 'utils/ts/cookie';
import useBanners from 'components/ui/Banner/hooks/useBanners';
import styles from './BannerB.module.scss';

interface BannerProps {
  categoryName: string;
  categoryId: number;
}

const HIDE_BANNER_DURATION_DAYS = 7;

function BannerB({ categoryName, categoryId }: BannerProps) {
  const logger = useLogger();
  const { data: bannersData } = useBanners(categoryId);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const currentBanner = bannersData.banners[currentPageIndex];
  const [isModalOpen, , closeModal] = useBooleanState((
    getCookie('HIDE_BANNER') !== categoryName
    && bannersData.count !== 0
  ));

  const handleImageLinkClick = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'main_modal',
      value: `${currentBanner.title}`,
    });
  };

  const handelPrevButtonClick = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'main_modal_next_modal',
      value: `${currentBanner.title}`,
    });
    setCurrentPageIndex((prev) => (prev === 0 ? bannersData.count - 1 : prev - 1));
  };

  const handelNextButtonClick = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'main_next_modal',
      value: `${currentBanner.title}`,
    });
    setCurrentPageIndex((prev) => (prev === bannersData.count - 1 ? 0 : prev + 1));
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
        event_label: 'CAMPUS_modal_1',
        value: 'design_B',
        event_category: 'a/b test 로깅(메인 모달)',
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <div className={styles.slider}>
          {currentBanner.redirect_link ? (
            <Link
              to={currentBanner.redirect_link}
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
          ) : (
            <div
              role="button"
              tabIndex={0}
              onClick={handleImageLinkClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleImageLinkClick();
                }
              }}
            >
              <img
                src={currentBanner.image_url}
                alt="banner"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/400.jpg?text=Coming+soon...';
                }}
                className={styles.slider__image}
              />
            </div>
          )}
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
          <div className={styles['slider__counter-bar']}>
            <div
              className={styles['slider__counter-bar--fill']}
              style={{
                left: `${(100 / bannersData.count) * currentPageIndex}%`,
                width: `${100 / bannersData.count}%`,
              }}
            />
          </div>
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
    </div>
  );
}

export default BannerB;
