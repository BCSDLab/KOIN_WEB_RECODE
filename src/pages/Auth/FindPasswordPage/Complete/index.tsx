import LogoIcon from 'assets/svg/Login/logo.svg';
import CheckIcon from 'assets/svg/orenge-check.svg';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import ROUTES from 'static/routes';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import styles from './Complete.module.scss';

const TITLE = '비밀번호 변경 완료';
const SUB_TITLE = [
  { key: 'line1', text: '비밀번호가 변경되었습니다.' },
  { key: 'line2', text: '새로운 비밀번호로 로그인 부탁드립니다.' },
];

function CompletePage() {
  const navigate = useNavigate();
  const { reset } = useFormContext();
  const isMobile = useMediaQuery();

  useEffect(() => {
    reset();
  }, [reset]);

  const goToLogin = () => navigate(ROUTES.Auth());

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        {isMobile ? <CheckIcon /> : <LogoIcon />}
      </div>

      <div className={styles['title-container']}>
        <h2 className={styles.title}>{TITLE}</h2>

        <div className={styles['subTitle-container']}>
          {SUB_TITLE.map(({ key, text }) => (
            <div key={key} className={styles.subTitle}>{text}</div>
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
