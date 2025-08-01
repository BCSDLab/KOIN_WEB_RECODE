import {
  Outlet, Link, useLocation, useNavigate,
} from 'react-router-dom';
import ROUTES from 'static/routes';
import styles from './Auth.module.scss';

function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={styles.template}>
      {location.pathname === ROUTES.Auth() && (
      <button type="button" className={styles['template__go-back']} onClick={() => navigate(-1)}>
        <img className={styles['template__left-arrow-image']} src="https://static.koreatech.in/assets/ic-room/left-arrow.png" alt="go back logo" />
      </button>
      )}
      <div className={styles.template__content}>
        {location.pathname === ROUTES.Auth() && (
        <Link className={styles.template__logo} to={ROUTES.Main()}>
          <img className={styles.template__image} src="https://static.koreatech.in/assets/img/logo_primary.png" alt="main logo" />
        </Link>
        )}
        <Outlet />
      </div>
    </div>
  );
}

export default AuthPage;
