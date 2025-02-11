import { Link } from 'react-router-dom';
import { Article } from 'api/articles/entity';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import setArticleRegisteredDate from 'utils/ts/setArticleRegisteredDate';
import { convertArticlesTag } from 'utils/ts/convertArticlesTag';
import ROUTES from 'static/routes';
import styles from './ArticleList.module.scss';

interface ArticleListProps {
  articles: Article[]
}

const parseLostItemTitle = (title: string) => {
  const parts = title.split('|').map((part) => part.trim());
  return {
    type: parts[0] || '',
    content: parts[1] || '',
    date: parts[2] || '',
  };
};

export default function ArticleList({ articles }: ArticleListProps) {
  const isMobile = useMediaQuery();

  const getLink = (article: Article) => {
    switch (article.board_id) {
      case 14:
        return ROUTES.LostItemDetail({ id: String(article.id), isLink: true });
      default:
        return ROUTES.ArticlesDetail({ id: String(article.id), isLink: true });
    }
  };

  return (
    <div className={styles.list}>
      {articles.map((article) => {
        if (article.board_id === 14) {
          const { type, content, date } = parseLostItemTitle(article.title);
          return (
            <Link
              className={styles.list__link}
              to={getLink(article)}
              key={article.id}
            >
              <div className={styles.list__id}>{article.id}</div>
              <div className={styles.title}>
                <div className={styles.title__container}>
                  <div className={styles['title__container-header']}>{ convertArticlesTag(article.board_id) }</div>
                  <div className={styles['title__container-type']}>{type}</div>
                  <div className={styles['title__container-container']}>{content}</div>
                  <div className={styles['title__container-container']}>|</div>
                  <div className={styles['title__container-container']}>{date}</div>
                </div>
                {setArticleRegisteredDate(article.registered_at)[1] && (
                  <img
                    className={styles['title__new-tag']}
                    src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png"
                    alt="new"
                  />
                )}
              </div>
              <div className={styles.list__author}>{isMobile ? `${article.author}` : article.author}</div>
              <div className={styles['list__registered-at']}>
                {setArticleRegisteredDate(article.registered_at)[0]}
              </div>
            </Link>
          );
        }

        return (
          <Link
            className={styles.list__link}
            to={getLink(article)}
            key={article.id}
          >
            <div className={styles.list__id}>{ article.id }</div>
            <div className={styles.title}>
              <div className={styles.title__header}>{ convertArticlesTag(article.board_id) }</div>
              <div className={styles.title__content}>{ article.title }</div>
              { setArticleRegisteredDate(article.registered_at)[1] && (
              <img
                className={styles['title__new-tag']}
                src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png"
                alt="new"
              />
              )}
            </div>
            <div className={styles.list__author}>{ isMobile ? `${article.author}` : article.author }</div>
            <div className={styles['list__registered-at']}>
              { setArticleRegisteredDate(article.registered_at)[0] }
            </div>
          </Link>
        );
      })}
    </div>
  );
}
