import { Outlet, Link } from 'react-router-dom';
import styles from './Auth.module.scss';

function AuthPage() {
  return (
    <div className={styles.template}>
      <Link className={styles['template__left-arrow']} to="/">
        <img className={styles['template__left-arrow-image']} src="https://static.koreatech.in/assets/ic-room/left-arrow.png" alt="go back logo" />
      </Link>
      <div className={styles.template__content}>
        <Link className={styles.template__logo} to="/">
          <img className={styles.template__image} src="https://static.koreatech.in/assets/img/logo_primary.png" alt="main logo" />
        </Link>
        <Outlet />
      </div>
    </div>
  );
}

export default AuthPage;
