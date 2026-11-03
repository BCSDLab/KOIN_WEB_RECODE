import Link from 'next/link';

import { useQuery } from '@tanstack/react-query';
import { articleQueries } from 'api/articles/queries';
import ArrowRightIcon from 'assets/svg/common/arrow-right-icon.svg';
import { convertArticlesTag } from 'components/Articles/utils/convertArticlesTag';
import { createArticlesWithNewSelector } from 'components/Articles/utils/selectArticlesData';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';

import styles from './IndexArticles.module.scss';

interface IndexArticlesProps {
  /** NEW 뱃지 판정 기준 시각. 서버가 확정해 내려준다. */
  serverNow: string;
}

export default function IndexArticles({ serverNow }: IndexArticlesProps) {
  const isLoggedIn = useIsLoggedIn();
  const { data: articlesData } = useQuery({
    ...articleQueries.list(isLoggedIn, '1'),
    select: createArticlesWithNewSelector(serverNow),
  });
  const logger = useLogger();

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
          전체보기
          <ArrowRightIcon aria-hidden />
        </Link>
      </div>

      <ul className={styles.list}>
        {articlesData?.articles.slice(0, 5).map((article) => (
          <li key={article.id} className={styles.list__item}>
            <Link
              href={ROUTES.ArticlesDetail({ id: String(article.id) })}
              prefetch={false}
              className={styles['list__item-link']}
            >
              <span className={styles['list__item-type']}>{convertArticlesTag(article.board_id)}</span>
              <span className={styles['list__item-title']}>{article.title}</span>
            </Link>
            <span className={styles['list__item-registered']}>{article.registered_at.replaceAll('-', '.')}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
