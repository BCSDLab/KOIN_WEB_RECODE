import styles from './index.module.scss';

export default function ReviewButton({ onClick }: { onClick: ()=> void }) {
  return (
    <button type="button" className={styles.container} onClick={onClick}>
      리뷰 작성하기
    </button>
  );
}
