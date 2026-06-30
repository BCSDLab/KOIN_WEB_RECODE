import Link from 'next/link';
import { HotArticle } from 'api/articles/entity';
import { convertArticlesTag } from 'components/Articles/utils/convertArticlesTag';
import ROUTES from 'static/routes';
import styles from './MobileArticleDetailFooter.module.scss';

interface MobileArticleDetailFooterProps {
  prevId: number;
  nextId: number;
  hotArticles: HotArticle[];
}

const formatTag = (boardId: number) => convertArticlesTag(boardId).replace(/^\[|\]$/g, '');

export default function MobileArticleDetailFooter({ prevId, nextId, hotArticles }: MobileArticleDetailFooterProps) {
  return (
    <div className={styles.footer}>
      <nav className={styles.navigation} aria-label="공지사항 상세 이동">
        <Link className={styles.navigation__button} href={ROUTES.Articles()}>
          목록
        </Link>
        <div className={styles.navigation__group}>
          {prevId ? (
            <Link className={styles.navigation__button} href={ROUTES.ArticlesDetail({ id: String(prevId) })}>
              이전 글
            </Link>
          ) : (
            <span className={styles['navigation__button--disabled']}>이전 글</span>
          )}
          {nextId ? (
            <Link className={styles.navigation__button} href={ROUTES.ArticlesDetail({ id: String(nextId) })}>
              다음 글
            </Link>
          ) : (
            <span className={styles['navigation__button--disabled']}>다음 글</span>
          )}
        </div>
      </nav>

      <section className={styles.popular} aria-labelledby="popular-notice-title">
        <h2 id="popular-notice-title" className={styles.popular__title}>
          인기있는 공지
        </h2>
        <div className={styles.popular__list}>
          {hotArticles.slice(0, 4).map((article) => (
            <Link className={styles.notice} href={ROUTES.ArticlesDetail({ id: String(article.id) })} key={article.id}>
              <span className={styles.notice__tag}>{formatTag(article.board_id)}</span>
              <span className={styles.notice__title}>{article.title}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
