import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import convertNoticeTag from 'utils/ts/convertNoticeTag';
import setArticleRegisteredDate from 'utils/ts/setArticleRegisteredDate';
import styles from './ArticleHeader.module.scss';

interface ArticleHeaderProps {
  boardId: number;
  title: string;
  registeredAt: string;
  author: string;
  hit: number;
}

export default function ArticleHeader({
  boardId,
  title,
  registeredAt,
  author,
  hit,
}: ArticleHeaderProps) {
  const isMobile = useMediaQuery();

  return (
    <div className={styles.header}>
      <div className={styles.title}>
        <span className={styles['title__board-id']}>{convertNoticeTag(boardId)}</span>
        <span className={styles.title__content}>{title}</span>
        {setArticleRegisteredDate(registeredAt)[1] && (
          <img
            className={styles['title__new-tag']}
            src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png"
            alt="new"
          />
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.content__author}>
          {isMobile ? `조회 ${hit} · ${author}` : author}
        </div>
        <div className={styles['content__registered-at']}>{registeredAt}</div>
      </div>
    </div>
  );
}
