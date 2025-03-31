import {
  Suspense,
  useState,
  useEffect,
  useCallback,
} from 'react';
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

function Banner({ categoryName, categoryId }: BannerProps) {
  const logger = useLogger();
  const logBannerCategory = categoryName === '메인 모달' ? 'main' : '';
  const [isModalOpen, , closeModal] = useBooleanState(true);
  const { banners } = useBanners(categoryId);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const currentBanner = banners.banners[currentPageIndex];

  const isBannerHidden = getCookie('HIDE_BANNER') === categoryName; // 일주일 동안 그만 보기
  const isBannerClose = sessionStorage.getItem('CLOSE_BANNER') === categoryName; // 닫기

  const handelPrevButtonClick = useCallback(() => {
    logger.actionEventClick({ team: 'CAMPUS', event_label: `${logBannerCategory}_next_modal`, value: `${currentBanner.title}` });
    logger.actionEventClick({ team: 'CAMPUS', event_label: 'a/b test 로깅(메인 모달)', value: 'design_A' }); // AB test용 로깅 (추후 삭제)
    setCurrentPageIndex((prev) => (prev === 0 ? banners.count - 1 : prev - 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [banners.count, currentBanner.title]);

  const handelNextButtonClick = useCallback(() => {
    logger.actionEventClick({ team: 'CAMPUS', event_label: `${logBannerCategory}_next_modal`, value: `${currentBanner.title}` });
    logger.actionEventClick({ team: 'CAMPUS', event_label: 'a/b test 로깅(메인 모달)', value: 'design_A' }); // AB test용 로깅 (추후 삭제)
    setCurrentPageIndex((prev) => (prev === banners.count - 1 ? 0 : prev + 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [banners.count, currentBanner.title]);

  const handleCloseBanner = () => {
    logger.actionEventClick({ team: 'CAMPUS', event_label: `${logBannerCategory}_modal_close`, value: `${currentBanner.title}` });
    logger.actionEventClick({ team: 'CAMPUS', event_label: 'a/b test 로깅(메인 모달)', value: 'design_A' }); // AB test용 로깅 (추후 삭제)
    sessionStorage.setItem('CLOSE_BANNER', categoryName);
    closeModal();
  };

  const handleHideForWeek = () => {
    logger.actionEventClick({ team: 'CAMPUS', event_label: `${logBannerCategory}_modal_hide_7d`, value: `${currentBanner.title}` });
    logger.actionEventClick({ team: 'CAMPUS', event_label: 'a/b test 로깅(메인 모달)', value: 'design_A' }); // AB test용 로깅 (추후 삭제)
    setCookie('HIDE_BANNER', categoryName, 7);
    closeModal();
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'ArrowLeft') {
        event.preventDefault();
        handelPrevButtonClick();
      } else if (event.code === 'ArrowRight') {
        event.preventDefault();
        handelNextButtonClick();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handelPrevButtonClick, handelNextButtonClick]);

  if (isBannerHidden || isBannerClose) return null;

  return (
    <Suspense fallback={null}>
      {isModalOpen && (
        <div className={styles.container}>
          <div className={styles.slider}>
            <a
              href={currentBanner.redirect_link ?? undefined}
              onClick={() => {
                logger.actionEventClick({ team: 'CAMPUS', event_label: `${logBannerCategory}_modal`, value: `${currentBanner.title}` });
                logger.actionEventClick({ team: 'CAMPUS', event_label: 'a/b test 로깅(메인 모달)', value: 'design_A' }); // AB test용 로깅 (추후 삭제)
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
            </a>
            <div className={styles.slider__pagination}>
              <p className={styles['slider__pagination-label']}>
                {currentPageIndex + 1}
                /
                {banners.count}
              </p>
            </div>
            <button
              type="button"
              className={styles['slider__arrow--previous']}
              aria-label="이전 슬라이드"
              onClick={handelPrevButtonClick}
            >
              <ArrowIcon />
            </button>
            <button
              type="button"
              className={styles['slider__arrow--next']}
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
      )}
    </Suspense>
  );
}

export default Banner;
