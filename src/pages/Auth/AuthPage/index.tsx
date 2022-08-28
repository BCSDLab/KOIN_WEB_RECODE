import { Outlet, Link } from 'react-router-dom';
import styles from './Auth.module.scss';

function AuthPage() {
  return (
    <div className={styles.template}>
      <div className={styles.template__content}>
        <Link className={styles.template__logo} to="/">
          <img className={styles.template__img} src="https://static.koreatech.in/assets/img/logo_primary.png" alt="logo" />
        </Link>
        <Outlet />
      </div>
    </div>
  );
}

export default AuthPage;
