import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Logo from 'assets/svg/Login/logo.svg';
import MobileLogo from 'assets/svg/Login/mobile-logo.svg';
import ROUTES from 'static/routes';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import styles from './Auth.module.scss';

function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isMobile = useMediaQuery();
  return (
    <div className={styles.template}>
      {router.pathname === ROUTES.Auth() && (
        <button type="button" className={styles['template__go-back']} onClick={() => router.back()}>
          <Image
            className={styles['template__left-arrow-image']}
            src="https://static.koreatech.in/assets/ic-room/left-arrow.png"
            alt="go back logo"
            width={30}
            height={30}
          />
        </button>
      )}
      <div className={styles.template__content}>
        {router.pathname === ROUTES.Auth() && (
          <Link className={styles.template__logo} href={ROUTES.Main()}>
            {!isMobile ? (
              <Logo className={styles.template__image} width={107} height={60} aria-label="main logo" />
            ) : (
              <MobileLogo className={styles.template__image} width={117} height={111} aria-label="main logo" />
            )}
          </Link>
        )}
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
