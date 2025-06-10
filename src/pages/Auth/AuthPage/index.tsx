import {
  Outlet, Link, useLocation, useNavigate,
} from 'react-router-dom';
import ROUTES from 'static/routes';
import { backbuttonTapp } from 'utils/ts/iosBridge';
import styles from './Auth.module.scss';

function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClickBack = () => {
    if (typeof window !== 'undefined'
    && window.webkit?.messageHandlers != null) {
      backbuttonTapp();
    } else {
      navigate(ROUTES.Main());
    }
  };

  return (
    <div className={styles.template}>
      <button type="button" className={styles['template__go-back']} onClick={handleClickBack}>
        <img className={styles['template__left-arrow-image']} src="https://static.koreatech.in/assets/ic-room/left-arrow.png" alt="go back logo" />
      </button>
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
