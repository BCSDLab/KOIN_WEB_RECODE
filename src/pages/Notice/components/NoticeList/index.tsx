import { Article } from 'api/notice/entity';
import { Link } from 'react-router-dom';
import ROUTES from 'static/routes';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import convertNoticeTag from 'utils/ts/convertNoticeTag';
import setArticleRegisteredDate from 'utils/ts/setArticleRegisteredDate';
import styles from './NoticeList.module.scss';

interface NoticeListProps {
  articles: Article[];
}

export default function NoticeList({ articles }: NoticeListProps) {
  const isMobile = useMediaQuery();

  return (
    <div>
      {articles.map((article) => (
        <Link
          className={styles.list}
          to={ROUTES.BoardNoticeDetail({ id: String(article.id), isLink: true })}
          key={article.id}
        >
          <div className={styles.list__id}>{article.id}</div>
          <div className={styles.title}>
            <div className={styles.title__header}>{convertNoticeTag(article.board_id)}</div>
            <div className={styles.title__content}>{article.title}</div>
            {setArticleRegisteredDate(article.registered_at)[1] && (
              <img
                className={styles['title__new-tag']}
                src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png"
                alt="new"
              />
            )}
          </div>
          <div className={styles.list__author}>
            {isMobile ? `${article.author}` : article.author}
          </div>
          <div className={styles['list__registered-at']}>
            {setArticleRegisteredDate(article.registered_at)[0]}
          </div>
        </Link>
      ))}
    </div>
  );
}
