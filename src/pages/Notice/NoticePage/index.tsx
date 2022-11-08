import cn from 'utils/ts/classnames';
import styles from './NoticePage.module.scss';

function NoticePage() {
  return (
    <div className={styles.template}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.header__title}>공지사항</h1>
        </div>
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
    </div>
  );
}

export default NoticePage;
