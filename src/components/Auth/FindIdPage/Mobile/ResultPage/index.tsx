import { useRouter } from 'next/router';
import ROUTES from 'static/routes';
import styles from './ResultPage.module.scss';

function ResultPage() {
  const router = useRouter();
  const { userId } = router.query;
  const onClickLogin = () => {
    router.push(ROUTES.Auth());
  };
  const onClickPassword = () => {
    router.push(ROUTES.AuthFindPW({ step: '계정인증', isLink: true }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>아이디 조회 결과</h1>
      <span className={styles.description}>
        아이디는
        <strong>
          {' '}
          {userId}
        </strong>
        입니다.
      </span>
      <div className={styles['button-wrapper']}>
        <button
          type="button"
          className={styles['button-wrapper__login-button']}
          onClick={onClickLogin}
        >
          로그인 바로가기
        </button>
        <button
          type="button"
          className={styles['button-wrapper__password-button']}
          onClick={onClickPassword}
        >
          비밀번호 찾기
        </button>
      </div>
    </div>
  );
}

export default ResultPage;
