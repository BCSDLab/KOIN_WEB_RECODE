import React from 'react';
import styles from './CourseHeader.module.scss';

interface CourseHeaderProps {
  onSearch: (e?: React.MouseEvent) => void;
}

export default function CourseHeader({ onSearch }: CourseHeaderProps) {
  return (
    <div className={styles.header}>
      <button type="button" className={styles.header__button} onClick={onSearch}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.header__icon}
          src="https://kut90.koreatech.ac.kr/nxweb/images/common/Button/btn_search.png"
          alt="조회"
        />
        조회
      </button>
      <button type="button" className={styles.header__button}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.header__icon}
          src="https://kut90.koreatech.ac.kr/nxweb/images/common/Button/btn_help.png"
          alt="도움말"
        />
        도움말
      </button>
      <button type="button" className={styles.header__button}>
        메인으로
      </button>
    </div>
  );
}
