import styles from './PostDetailHeader.module.scss';

function PostDetailHeader() {
  return (
    <div className={styles.header}>
      <div className={styles.title}>
        <span className={styles.title__board_id}>id</span>
        <span className={styles.title__content}>title</span>
        <div className={styles.title__comment_count}>comment_count</div>
        <img className={styles.title__new_tag} src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png" alt="NewTag" />
      </div>
      <div className={styles.content}>
        <div className={styles.content__author}>author</div>
        <div className={styles.content__create_at}>created_at</div>
      </div>
    </div>
  );
}

export default PostDetailHeader;
