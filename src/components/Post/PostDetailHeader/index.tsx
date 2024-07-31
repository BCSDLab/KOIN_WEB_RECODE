import setPostCreateDate from 'utils/ts/setPostCreateDate';
import convertNoticeTag from 'utils/ts/convertNoticeTag';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import styles from './PostDetailHeader.module.scss';

type PostDetailHeaderProps = {
  boardId: number
  title: string
  createdAt: string
  commentCount: number
  nickname: string
  hit: number
};

function PostDetailHeader(props: PostDetailHeaderProps) {
  const {
    boardId,
    title,
    createdAt,
    commentCount,
    nickname,
    hit,
  } = props;
  const isMobile = useMediaQuery();

  return (
    <div className={styles.header}>
      <div className={styles.title}>
        <span className={styles['title__board-id']}>{convertNoticeTag(boardId)}</span>
        <span className={styles.title__content}>{title}</span>
        <span className={styles['title__comment-count']}>{`[${commentCount}]`}</span>
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

export default PostDetailHeader;
