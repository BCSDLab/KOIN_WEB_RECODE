import {
  Outlet, Link, useLocation, useNavigate,
} from 'react-router-dom';
import ROUTES from 'static/routes';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import BlackArrowBackIcon from 'assets/svg/black-arrow-back-icon.svg';
import { backbuttonTapp } from 'utils/ts/iosBridge';
import styles from './Auth.module.scss';

function AuthPage() {
  const location = useLocation();
  const isMobile = useMediaQuery();
  const navigate = useNavigate();
  const handleClickBack = () => {
    if (typeof window !== 'undefined'
    && window.webkit?.messageHandlers != null) {
      backbuttonTapp();
    } else {
      navigate(-1);
    }
  };
  return (
    <div className={styles.template}>
      {isMobile && (
        <button
          type="button"
          aria-label="뒤로가기"
          className={styles['back-button']}
          onClick={handleClickBack}
        >
          <BlackArrowBackIcon />
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
