import { ReactNode } from 'react';
import ChevronLeftIcon from 'assets/svg/Login/chevron-left.svg';
import ROUTES from 'static/routes';
import { useRouter } from 'next/dist/client/components/navigation';
import styles from './Mobile.module.scss';

interface LayoutProps {
  children: ReactNode;
}

function MobileLayout({ children }: LayoutProps) {
  const router = useRouter();
  const navigate = router.push;
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
        <span className={styles.container__title}>아이디 찾기</span>
      </div>

      {children}
    </div>
  );
}

export default MobileLayout;
