import cn from 'utils/ts/classnames';
import styles from './PostHeader.module.scss';

function PostHeader() {
  return (
    <div className={styles.header}>
      <div className={styles.header__container}>
        <div className={styles.header__row}>
          <div className={cn({
            [styles.info]: true,
            [styles['info--number']]: true,
          })}
          >
            번호
          </div>
          <div className={cn({
            [styles.info]: true,
            [styles['info--title']]: true,
          })}
          >
            제목
          </div>
          <div className={cn({
            [styles.info]: true,
            [styles['info--author']]: true,
          })}
          >
            작성자
          </div>
          <div className={cn({
            [styles.info]: true,
            [styles['info--date']]: true,
          })}
          >
            날짜
          </div>
          <div className={cn({
            [styles.info]: true,
            [styles['info--views']]: true,
          })}
          >
            조회수
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostHeader;
