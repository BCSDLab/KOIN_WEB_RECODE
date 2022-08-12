import { Outlet, Link } from 'react-router-dom';
import styles from './AuthPage.module.scss';

function AuthPage() {
  return (
    <div className={styles.template}>
      <Link to="/">
        <img src="https://static.koreatech.in/assets/img/logo_primary.png" alt="logo" className={styles.template__logo} />
      </Link>
      <Outlet />
    </div>
  );
}

export default AuthPage;
