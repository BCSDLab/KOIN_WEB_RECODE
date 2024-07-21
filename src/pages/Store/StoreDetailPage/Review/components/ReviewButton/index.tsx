import styles from './index.module.scss';

export default function ReviewButton() {
  return (
    <button type="button" className={styles.container}>
      리뷰 작성하기
    </button>
  );
}
