import {
  Suspense,
  useState,
  useEffect,
  useCallback,
} from 'react';
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
  const [isModalOpen, , closeModal] = useBooleanState(true);
  const { banners } = useBanners(categoryId);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const isBannerHidden = getCookie('HIDE_BANNER') === categoryName;

  const handelPrevButtonClick = useCallback(() => {
    setCurrentPageIndex((prev) => (prev === 0 ? banners.count - 1 : prev - 1));
  }, [banners.count]);

  const handelNextButtonClick = useCallback(() => {
    setCurrentPageIndex((prev) => (prev === banners.count - 1 ? 0 : prev + 1));
  }, [banners.count]);

  const handleHideForWeek = () => {
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

  if (isBannerHidden) return null;

  return (
    <Suspense fallback={null}>
      {isModalOpen && (
        <div className={styles.container}>
          <div className={styles.slider}>
            <img
              src={banners.banners[currentPageIndex].image_url}
              alt="banner"
              className={styles.slider__image}
            />
            <div className={styles.slider__pagination}>
              <p className={styles['slider__pagination-label']}>
                {currentPageIndex + 1}
                /
                {banners.count}
              </p>
            </div>
            <div className={styles.slider__arrow}>
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
              onClick={closeModal}
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
