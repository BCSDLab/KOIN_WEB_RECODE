import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import ChevronLeftIcon from 'assets/svg/Login/chevron-left.svg';
import ROUTES from 'static/routes';
import { useNavigate } from 'react-router-dom';
import styles from './FindIdPage.module.scss';
import MobileFindIdPage from './MobileFindIdPage';
import PCFindIdPage from './PCFindIdPage';

function FindIdPage() {
  const isMobile = useMediaQuery();
  const navigate = useNavigate();
  const goBack = () => {
    navigate(ROUTES.Auth());
  };

  return (
    <div className={styles.container}>
      {isMobile
        ? (
          <>
            <div className={styles.container__header}>
              <button
                type="button"
                className={styles.container__button}
                onClick={goBack}
                aria-label="button"
              >
                <ChevronLeftIcon />
              </button>
              <span className={styles.container__title}>아이디 찾기</span>
            </div>
            <MobileFindIdPage />
          </>
        ) : (
          <PCFindIdPage />
        )}
    </div>
  );
}

export default FindIdPage;
