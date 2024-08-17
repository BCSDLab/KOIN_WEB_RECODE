import setPostCreateDate from 'utils/ts/setPostCreateDate';
import convertNoticeTag from 'utils/ts/convertNoticeTag';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import styles from './ArticleHeader.module.scss';

type ArticleHeaderProps = {
  boardId: number
  title: string
  createdAt: string
  nickname: string
  hit: number
};

function ArticleHeader(props: ArticleHeaderProps) {
  const {
    boardId,
    title,
    createdAt,
    nickname,
    hit,
  } = props;
  const isMobile = useMediaQuery();

  return (
    <div className={styles.header}>
      <div className={styles.title}>
        <span className={styles['title__board-id']}>{convertNoticeTag(boardId)}</span>
        <span className={styles.title__content}>{title}</span>
        { setPostCreateDate(createdAt)[1] && (
          <img
            className={styles['title__new-tag']}
            src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png"
            alt="new"
          />
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.content__author}>{ isMobile ? `조회 ${hit} · ${nickname}` : nickname }</div>
        <div className={styles['content__create-at']}>{createdAt}</div>
      </div>
    </div>
  );
}

export default ArticleHeader;
