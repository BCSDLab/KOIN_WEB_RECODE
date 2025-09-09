import { useRouter } from 'next/router';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import { setRedirectPath } from 'utils/ts/auth';
import styles from './GraduationCalculatorAuthModal.module.scss';

export default function GraduationCalculatorAuthModal() {
  const logger = useLogger();
  const router = useRouter();
  const navigate = (path: string) => router.push(path);

  const onClickLogin = () => {
    logger.actionEventClick({
      team: 'USER',
      event_label: 'graduation_calculator_login',
      value: '로그인',
    });
    navigate(ROUTES.Auth());
    setRedirectPath(ROUTES.GraduationCalculator());
  };

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <div className={styles.container__notice}>
          <h4 className={styles['container__notice--title']}>
            졸업학점 계산기를 사용하기
            <br />
            위해 로그인이 필요해요.
          </h4>
          <div className={styles['container__notice--description']}>졸업학점 계산기는 로그인이 필요한 서비스입니다.</div>
        </div>
        <div className={styles.container__button}>
          <button
            type="button"
            className={styles['container__button--login']}
            onClick={onClickLogin}
          >
            로그인하기
          </button>
          <button
            type="button"
            className={styles['container__button--back']}
            onClick={() => router.back()}
          >
            이전 화면으로 가기
          </button>
        </div>
      </div>
    </div>
  );
}
