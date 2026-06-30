import Link from 'next/link';
import { convertArticlesTag } from 'components/Articles/utils/convertArticlesTag';
import ROUTES from 'static/routes';
import showToast from 'utils/ts/showToast';
import type { ArticleWithNew } from 'api/articles/entity';
import styles from './MobileArticleList.module.scss';

interface MobileArticleListProps {
  articles: ArticleWithNew[];
}

const formatDate = (time: string) => {
  if (typeof time !== 'string') return '';
  return time.split(' ')[0].replaceAll('-', '.');
};

const getLink = (article: ArticleWithNew) => {
  if (article.board_id === 14) return ROUTES.LostItemDetail({ id: String(article.id) });
  return ROUTES.ArticlesDetail({ id: String(article.id) });
};

export default function MobileArticleList({ articles }: MobileArticleListProps) {
  return (
    <div className={styles.list}>
      {articles.map((article) => {
        const registeredDate = formatDate(article.registered_at);
        const tag = convertArticlesTag(article.board_id);

        if (article.board_id === 14 && article.is_reported) {
          return (
            <div
              key={article.id}
              className={styles.item}
              role="button"
              onClick={() => showToast('error', '신고된 게시글은 더 이상 볼 수 없습니다.')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') showToast('error', '신고된 게시글은 더 이상 볼 수 없습니다.');
              }}
              tabIndex={0}
            >
              <span className={styles.item__tag}>{tag}</span>
              <p className={styles.item__title}>신고에 의해 숨김 처리 되었습니다.</p>
              <div className={styles.item__meta}>
                <span className={styles['item__meta-author']}>{article.author}</span>
                <span className={styles['item__meta-date']}>{registeredDate}</span>
              </div>
            </div>
          );
        }

        return (
          <Link key={article.id} href={getLink(article)} className={styles.item}>
            <span className={styles.item__tag}>{tag}</span>
            <p className={styles.item__title}>{article.title}</p>
            <div className={styles.item__meta}>
              <span className={styles['item__meta-author']}>{article.author}</span>
              <span className={styles['item__meta-date']}>{registeredDate}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
