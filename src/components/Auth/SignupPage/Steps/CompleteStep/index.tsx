import LogoIcon from 'assets/svg/Login/logo.svg';
import { useRouter } from 'next/router';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import styles from './CompleteStep.module.scss';

function CompleteStep() {
  const router = useRouter();
  const isMobile = useMediaQuery();

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <LogoIcon />
      </div>

      {isMobile ? (
        <>
          <span className={styles.title}>회원가입이 완료되었습니다.</span>
          <div className={styles['button-container']}>
            <button
              className={`${styles['button-container__button']} ${styles['button-container__button--orange']}`}
              type="button"
              onClick={() => {
                router.push('/auth');
              }}
            >
              로그인 바로가기
            </button>
            <button
              className={`${styles['button-container__button']} ${styles['button-container__button--blue']}`}
              type="button"
              onClick={() => router.push('/')}
            >
              홈화면 바로가기
            </button>
          </div>
        </>
      ) : (
        <div>
          <h2 className={styles.title}>회원가입 완료</h2>

          <div className={styles['subTitle-container']}>
            <div className={styles.subTitle}>회원가입이 완료되었습니다.</div>
            <div className={styles.subTitle}>홈페이지에서 바로 로그인이 가능합니다.</div>
          </div>

          <button
            className={styles['button-login-navigate']}
            type="button"
            onClick={() => {
              router.push('/auth');
            }}
          >
            로그인 화면 바로가기
          </button>
        </div>
      )}
    </div>
  );
}

export default CompleteStep;
