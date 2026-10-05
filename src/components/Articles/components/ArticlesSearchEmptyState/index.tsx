import SleepIcon from 'assets/svg/common/sleep-bbico.svg';
import styles from './ArticlesSearchEmptyState.module.scss';

export default function ArticlesSearchEmptyState() {
  return (
    <div className={styles.empty}>
      <SleepIcon className={styles.empty__icon} />
      <p className={styles.empty__text}>
        일치하는 공지글이 없습니다.
        <br />
        다른 키워드로 다시 시도해주세요.
      </p>
    </div>
  );
}
