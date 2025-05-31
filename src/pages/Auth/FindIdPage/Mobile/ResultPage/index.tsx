import { useNavigate, useSearchParams } from 'react-router-dom';
import ROUTES from 'static/routes';
import styles from './ResultPage.module.scss';

function ResultPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const onClickLogin = () => {
    navigate(ROUTES.Auth());
  };
  const onClickPassword = () => {
    navigate(ROUTES.AuthFindPW());
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
