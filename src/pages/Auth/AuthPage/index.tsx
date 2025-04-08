/* eslint-disable jsx-a11y/control-has-associated-label */
import { Link, Outlet, useNavigate } from 'react-router-dom';
import ChevronLeftIcon from 'assets/svg/Login/chevron-left.svg';
import ROUTES from 'static/routes';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import styles from './Auth.module.scss';

function AuthPage() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery();

  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <div className={styles.template}>
      {isMobile && (
      <div className={styles.template__header}>
        <button
          type="button"
          className={styles.template__button}
          onClick={handleGoBack}
        >
          <ChevronLeftIcon />
        </button>
        <span className={styles.template__title}>회원가입</span>
      </div>
      )}
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
