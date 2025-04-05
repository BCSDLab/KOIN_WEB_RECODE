/* eslint-disable jsx-a11y/control-has-associated-label */
import { Outlet, useNavigate } from 'react-router-dom';
import ROUTES from 'static/routes';
import ChevronLeftIcon from 'assets/svg/Login/chevron-left.svg';
import styles from './Auth.module.scss';

function AuthPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(ROUTES.Main());
  };
  return (
    <div className={styles.template}>
      <div className={styles.template__header}>
        <button
          type="button"
          className={styles.template__button}
          onClick={handleGoBack}
        >
          <ChevronLeftIcon />
        </button>
      </div>
      <div className={styles.template__content}>
        {/* <Link className={styles.template__logo} to={ROUTES.Main()}>
          <img className={styles.template__image} src="https://static.koreatech.in/assets/img/logo_primary.png" alt="main logo" />
        </Link> */}
        <Outlet />
      </div>
    </div>
  );
}

export default AuthPage;
