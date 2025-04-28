import LogoIcon from 'assets/svg/Login/logo.svg';
import { useNavigate } from 'react-router-dom';
import styles from './CompleteStep.module.scss';

function CompleteStep() {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <LogoIcon />
      </div>
      <span className={styles.title}>회원가입이 완료되었습니다.</span>
      <div className={styles['button-container']}>
        <button
          className={`${styles['button-container__button']} ${styles['button-container__button--orange']}`}
          type="button"
          onClick={() => {
            navigate('/auth');
          }}
        >
          로그인 바로가기
        </button>
        <button
          className={`${styles['button-container__button']} ${styles['button-container__button--blue']}`}
          type="button"
          onClick={() => navigate('/')}
        >
          홈화면 바로가기
        </button>
      </div>
    </div>
  );
}

export default CompleteStep;
