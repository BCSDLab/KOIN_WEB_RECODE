import SleepIcon from 'assets/svg/common/sleep-bbico.svg';
import styles from './SearchEmptyState.module.scss';

export default function SearchEmptyState() {
  return (
    <div className={styles.empty}>
      <SleepIcon className={styles.empty__icon} />
      <p className={styles.empty__text}>
        검색결과가 없습니다.
        <br />
        다른 검색어로 다시 검색해주세요.
      </p>
    </div>
  );
}
