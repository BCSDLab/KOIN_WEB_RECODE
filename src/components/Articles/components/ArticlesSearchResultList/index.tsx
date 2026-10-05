import Link from 'next/link';
import { convertArticlesTag } from 'components/Articles/utils/convertArticlesTag';
import ROUTES from 'static/routes';
import type { Article } from 'api/articles/entity';
import styles from './ArticlesSearchResultList.module.scss';

interface ArticlesSearchResultListProps {
  articles: Article[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

const formatDate = (time: string) => {
  if (typeof time !== 'string') return '';
  return time.split(' ')[0].replaceAll('-', '.');
};

const formatTag = (boardId: number) => convertArticlesTag(boardId).replace(/^\[|\]$/g, '');

export default function ArticlesSearchResultList({
  articles,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: ArticlesSearchResultListProps) {
  return (
    <div className={styles.list}>
      {articles.map((article) => (
        <Link
          key={article.id}
          href={ROUTES.ArticlesDetail({ id: String(article.id) })}
          className={styles.item}
        >
          <span className={styles.item__tag}>{formatTag(article.board_id)}</span>
          <p className={styles.item__title}>{article.title}</p>
          <div className={styles.item__meta}>
            <span className={styles['item__meta-author']}>{article.author}</span> &nbsp; • &nbsp;
            <span className={styles['item__meta-date']}>{formatDate(article.registered_at)}</span>
          </div>
        </Link>
      ))}
      {hasNextPage && (
        <button
          type="button"
          className={styles['load-more']}
          onClick={onLoadMore}
          disabled={isFetchingNextPage}
        >
          게시물 더보기
        </button>
      )}
    </div>
  );
}
