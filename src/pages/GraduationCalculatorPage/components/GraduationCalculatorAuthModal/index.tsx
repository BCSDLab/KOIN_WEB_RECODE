import { useNavigate } from 'react-router-dom';
import styles from './GraduationCalculatorAuthModal.module.scss';

export default function GraduationCalculatorAuthModal() {
  const navigate = useNavigate();

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
            onClick={() => navigate('/auth')}
          >
            로그인하기
          </button>
          <button
            type="button"
            className={styles['container__button--back']}
            onClick={() => navigate(-1)}
          >
            이전 화면으로 가기
          </button>
        </div>
      </div>
    </div>
  );
}
