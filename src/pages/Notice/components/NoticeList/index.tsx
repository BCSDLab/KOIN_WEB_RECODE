import { Link } from 'react-router-dom';
import { Article } from 'api/notice/entity';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import setArticleCreateDate from 'utils/ts/setArticleCreateDate';
import convertNoticeTag from 'utils/ts/convertNoticeTag';
import styles from './NoticeList.module.scss';

interface NoticeListProps {
  articles: Article[]
}

export default function NoticeList({ articles }: NoticeListProps) {
  const isMobile = useMediaQuery();

  return (
    <div>
      {articles.map((article) => (
        <Link
          className={styles.list}
          to={`/board/notice/${article.id}`}
          key={article.id}
        >
          <div className={styles.list__id}>{ article.id }</div>
          <div className={styles.title}>
            <div className={styles.title__header}>{ convertNoticeTag(article.board_id) }</div>
            <div className={styles.title__content}>{ article.title }</div>
            { setArticleCreateDate(article.created_at)[1] && (
              <img
                className={styles['title__new-tag']}
                src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png"
                alt="new"
              />
            )}
          </div>
          <div className={styles.list__author}>{ isMobile ? `${article.nickname}` : article.nickname }</div>
          <div className={styles['list__created-at']}>
            { setArticleCreateDate(article.created_at)[0] }
          </div>
        </Link>
      ))}
    </div>
  );
}
