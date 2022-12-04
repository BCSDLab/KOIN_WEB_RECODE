import cn from 'utils/ts/classnames';
import styles from './PostHeader.module.scss';

function PostHeader() {
  return (
    <div className={styles['post-section']}>
      <div className={styles['post-header']}>
        <div className={styles['post-row']}>
          <div className={cn({
            [styles['post-info']]: true,
            [styles['post-info--number']]: true,
          })}
          >
            번호
          </div>
          <div className={cn({
            [styles['post-info']]: true,
            [styles['post-info--title']]: true,
          })}
          >
            제목
          </div>
          <div className={cn({
            [styles['post-info']]: true,
            [styles['post-info--author']]: true,
          })}
          >
            작성자
          </div>
          <div className={cn({
            [styles['post-info']]: true,
            [styles['post-info--date']]: true,
          })}
          >
            날짜
          </div>
          <div className={cn({
            [styles['post-info']]: true,
            [styles['post-info--views']]: true,
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
