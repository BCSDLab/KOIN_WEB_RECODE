import { Link } from 'react-router-dom';
import { ArticleList } from 'api/notice/entity';
import setPostCreateDate from 'components/Post/utils/setPostCreateDate';
import convertNoticeTag from 'components/Post/utils/convertNoticeTag';
import styles from './PostList.module.scss';

type ArticleListProps = {
  articles: ArticleList[] | undefined
};

function PostList(props: ArticleListProps) {
  const { articles } = props;

  return (
    <div>
      {
        articles?.map((article: ArticleList) => (
          <Link
            className={styles.list}
            to={`/board/notice/${article.id}`}
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
            <div className={styles.list__author}>{ article.nickname }</div>
            <div className={styles.list__created_at}>
              { setPostCreateDate(article.created_at)[0] }
            </div>
            <div className={styles.list__views}>{ article.hit }</div>
          </Link>
        ))
      }
    </div>
  );
}

export default PostList;
