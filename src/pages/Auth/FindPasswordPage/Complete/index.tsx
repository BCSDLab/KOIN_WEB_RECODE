import LogoIcon from 'assets/svg/Login/logo.svg';
import CheckIcon from 'assets/svg/orenge-check.svg';
import { useNavigate } from 'react-router-dom';
import ROUTES from 'static/routes';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import styles from './Complete.module.scss';

function CompletePage() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery();

  const goToLogin = () => navigate(ROUTES.Auth());

  const title = '비밀번호 변경 완료';
  const subTitles = isMobile
    ? ['비밀번호가 변경되었습니다.', '새로운 비밀번호로 로그인 부탁드립니다.']
    : ['비밀번호 변경이 완료되었습니다.', '홈페이지에서 바로 로그인이 가능합니다.'];

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        {isMobile ? <CheckIcon /> : <LogoIcon />}
      </div>

      <div className={styles['title-container']}>
        <h2 className={styles.title}>{title}</h2>

        <div className={styles['subTitle-container']}>
          {subTitles.map((line, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={idx} className={styles.subTitle}>
              {line}
            </div>
          ))}
        </div>
      </div>

      <div className={styles['button-container']}>
        <button
          type="button"
          className={styles['button-container__button']}
          onClick={goToLogin}
        >
          로그인 화면 바로가기
        </button>
      </div>
    </div>
  );
}

export default CompletePage;
