import ErrorIcon from 'assets/svg/Club/input-error-icon.svg';
import styles from './ClubInputErrorCondition.module.scss';

export default function ClubInputErrorCondition() {
  return (
    <div className={styles.layout}>
      <ErrorIcon />
      필수 입력란입니다.
    </div>
  );
}
