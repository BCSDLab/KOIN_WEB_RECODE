import styles from './NoticePage.module.scss';

function NoticePage() {
  return (
    <div className={styles.template}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.header__title}>공지사항</h1>
        </div>
      </div>
    </div>
  );
}

export default NoticePage;
