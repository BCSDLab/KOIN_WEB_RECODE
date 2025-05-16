import { cn } from '@bcsdlab/utils';
import BackIcon from 'assets/svg/arrow-back.svg';
import { useNavigate } from 'react-router-dom';
import ROUTES from 'static/routes';
import styles from './FindIdPhonePage.module.scss';

function FindIdPhonePage() {
  const navigate = useNavigate();

  const onBack = () => {
    navigate(ROUTES.Auth());
  };
  return (
    <div className={styles.container}>
      <div className={styles.container__wrapper}>
        <div className={styles['container__title-wrapper']}>
          <button type="button" onClick={onBack} aria-label="뒤로가기">
            <BackIcon />
          </button>
          <h1 className={styles['container__title-wrapper--title']}>아이디 찾기</h1>
        </div>
        <div className={`${styles.divider} ${styles['divider--top']}`} />

        <div className={`${styles.divider} ${styles['divider--bottom']}`} />
      </div>
      <button
        type="button"
        // onClick={onNext}
        className={cn({
          [styles['button-wrapper__next-button']]: true,
          // [styles['button-wrapper__next-button--active']]: isFormFilled,
        })}
        // disabled={!isFormFilled}
      >
        다음
      </button>
    </div>
  );
}

export default FindIdPhonePage;
