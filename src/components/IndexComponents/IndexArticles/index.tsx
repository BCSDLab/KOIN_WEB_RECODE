import Suspense from 'components/ssr/SSRSuspense';
import RightArrow from 'assets/svg/right-arrow.svg';
import useArticles from 'components/Articles/hooks/useArticles';
import useLogger from 'utils/hooks/analytics/useLogger';
import setArticleRegisteredDate from 'components/Articles/utils/setArticleRegisteredDate';
import ROUTES from 'static/routes';
import { convertArticlesTag } from 'components/Articles/utils/convertArticlesTag';
import Link from 'next/link';
import styles from './IndexArticles.module.scss';

export default function IndexArticles() {
  const { articles } = useArticles();
  const logger = useLogger();

  const getLink = (id: string, boardId: number) => {
    switch (boardId) {
      case 14:
        return ROUTES.LostItemDetail({ id, isLink: true });
      default:
        return ROUTES.ArticlesDetail({ id, isLink: true });
    }
  };

  return (
    <section className={styles.template}>
      <div className={styles.template__header}>
        <Link
          href={ROUTES.Articles()}
          className={styles['template__title-link']}
          onClick={() => logger.actionEventClick({ team: 'CAMPUS', event_label: 'main_notice', value: '공지사항' })}
        >
          <h1 className={styles.template__title}>공지사항</h1>
        </Link>
        <Link
          href={ROUTES.Articles()}
          className={styles.template__link}
          onClick={() =>
            logger.actionEventClick({ team: 'CAMPUS', event_label: 'main_notice_detail', value: '공지사항' })
          }
        >
          더보기
          <RightArrow aria-hidden />
        </Link>
      </div>

      <Suspense fallback={<div />}>
        <ul className={styles.list}>
          {articles.slice(0, 7).map((article) => (
            <li key={article.id} className={styles.list__item}>
              <Link href={getLink(String(article.id), article.board_id)} className={styles['list__item-link']}>
                <span className={styles['list__item-type']}>{convertArticlesTag(article.board_id)}</span>
                <span className={styles['list__item-title']}>{article.title}</span>
                {setArticleRegisteredDate(article.registered_at) && (
                  <img
                    className={styles['list__item-tag']}
                    src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png"
                    alt="NEW"
                    aria-hidden
                  />
                )}
              </Link>
              <span className={styles['list__item-registered']}>{article.registered_at.replaceAll('-', '.')}</span>
            </li>
          ))}
        </ul>
      </Suspense>
    </section>
  );
}
