import { Link } from 'react-router-dom';
import { ArticleList } from 'api/notice/entity';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import setPostCreateDate from 'utils/ts/setPostCreateDate';
import convertNoticeTag from 'utils/ts/convertNoticeTag';
import ROUTES from 'static/routes';
import styles from './PostList.module.scss';

interface PostListProps {
  articles: ArticleList[] | undefined
}

function PostList(props: PostListProps) {
  const { articles } = props;
  const isMobile = useMediaQuery();

  return (
    <div>
      {
        articles?.map((article) => (
          <Link
            className={styles.list}
            to={`${ROUTES.BOARD_NOTICE_DETAIL.replace(':id', String(article.id))}`}
            key={article.id}
          >
            <div className={styles.list__id}>{ article.id }</div>
            <div className={styles.title}>
              <div className={styles.title__header}>{ convertNoticeTag(article.board_id) }</div>
              <div className={styles.title__content}>{ article.title }</div>
              { setPostCreateDate(article.created_at)[1] && (
                <img
                  className={styles.title__newTag}
                  src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png"
                  alt="new"
                />
              )}
            </div>
            <div className={styles.list__author}>{ isMobile ? `${article.nickname}` : article.nickname }</div>
            <div className={styles.list__created_at}>
              { setPostCreateDate(article.created_at)[0] }
            </div>
          </Link>
        ))
      }
    </div>
  );
}

export default PostList;
