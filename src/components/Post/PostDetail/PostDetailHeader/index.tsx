import setPostCreateDate from 'components/Post/utils/setPostCreateDate';
import convertNoticeTag from 'components/Post/utils/convertNoticeTag';
import styles from './PostDetailHeader.module.scss';

type PostDetailHeaderProps = {
  boardId: number
  title: string
  createdAt: string
  commentCount: number
  nickname: string
};

function PostDetailHeader(props: PostDetailHeaderProps) {
  const {
    boardId,
    title,
    createdAt,
    commentCount,
    nickname,
  } = props;

  return (
    <div className={styles.header}>
      <div className={styles.title}>
        <span className={styles.title__board_id}>{convertNoticeTag(boardId)}</span>
        <span className={styles.title__content}>{title}</span>
        <span className={styles.title__comment_count}>{`[${commentCount}]`}</span>
        { setPostCreateDate(createdAt)[1] && (
          <img
            className={styles.title__new_tag}
            src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png"
            alt="new"
          />
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.content__author}>{nickname}</div>
        <div className={styles.content__create_at}>{createdAt}</div>
      </div>
    </div>
  );
}

export default PostDetailHeader;
