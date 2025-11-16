import Link from 'next/link';
import { useRouter } from 'next/router';
import ROUTES from 'static/routes';
import styles from './Auth.module.scss';

function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className={styles.template}>
      {router.pathname === ROUTES.Auth() && (
        <button type="button" className={styles['template__go-back']} onClick={() => router.back()}>
          <img
            className={styles['template__left-arrow-image']}
            src="https://static.koreatech.in/assets/ic-room/left-arrow.png"
            alt="go back logo"
          />
        </button>
      )}
      <div className={styles.template__content}>
        {router.pathname === ROUTES.Auth() && (
          <Link className={styles.template__logo} href={ROUTES.Main()}>
            <img
              className={styles.template__image}
              src="https://static.koreatech.in/assets/img/logo_primary.png"
              alt="main logo"
            />
          </Link>
        )}
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
