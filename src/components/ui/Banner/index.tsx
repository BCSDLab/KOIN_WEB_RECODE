import React from 'react';
import ArrowIcon from 'assets/svg/previous-arrow-icon.svg';
import styles from './Banner.module.scss';

function Banner() {
  return (
    <div className={styles.container}>
      <div className={styles.slider}>
        <img src="" alt="banner" className={styles.slider__image} />
        <div className={styles.slider__pagination}>0/0</div>
        <div className={styles.slider__arrow}>
          <button type="button" className={styles['slider__arrow--Previous']} aria-label="이전 슬라이드">
            <ArrowIcon />
          </button>
          <button type="button" className={styles['slider__arrow--Next']} aria-label="다음 슬라이드">
            <ArrowIcon />
          </button>
        </div>
      </div>
      <div className={styles.footer}>
        <button type="button" className={styles['footer__button--hide']}>일주일 동안 그만 보기</button>
        <button type="button" className={styles['footer__button--close']}>닫기</button>
      </div>
    </div>
  );
}

export default Banner;
