// src/pages/Auth/FindIdPage/Mobile/Layout.tsx

import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import ChevronLeftIcon from 'assets/svg/Login/chevron-left.svg';
import ROUTES from 'static/routes';
import styles from './Mobile.module.scss';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

function MobileLayout({ children, title = '아이디 찾기' }: LayoutProps) {
  const navigate = useNavigate();
  const handleBack = () => navigate(ROUTES.Auth());

  return (
    <div className={styles.container}>
      <div className={styles.container__header}>
        <button
          type="button"
          className={styles.container__button}
          onClick={handleBack}
          aria-label="뒤로가기"
        >
          <ChevronLeftIcon />
        </button>
        <span className={styles.container__title}>{title}</span>
      </div>

      {children}
    </div>
  );
}

export default MobileLayout;
