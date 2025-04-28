import { Outlet, Link } from 'react-router-dom';
import ROUTES from 'static/routes';
import styles from './Auth.module.scss';

function AuthPage() {
  return (
    <div className={styles.template}>
      <div className={styles.template__content}>
        <Link className={styles.template__logo} to={ROUTES.Main()}>
          <img className={styles.template__image} src="https://static.koreatech.in/assets/img/logo_primary.png" alt="main logo" />
        </Link>
        <Outlet />
      </div>
    </div>
  );
}

export default AuthPage;
