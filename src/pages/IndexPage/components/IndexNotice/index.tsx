import { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as RightArrow } from 'assets/svg/right-arrow.svg';
import useArticles from 'pages/Notice/hooks/useArticles';
import useLogger from 'utils/hooks/analytics/useLogger';
import setArticleRegisteredDate from 'utils/ts/setArticleRegisteredDate';
import ROUTES from 'static/routes';
import styles from './IndexNotice.module.scss';

const getArticleType = (id: number) => {
  switch (id) {
    case 5:
      return '[일반공지]';
    case 6:
      return '[장학공지]';
    case 7:
      return '[학사공지]';
    case 8:
      return '[취업공지]';
    default:
      return '[공지]';
  }
};

function IndexNotice() {
  const { articles } = useArticles();
  const logger = useLogger();

  return (
    <section className={styles.template}>
      <div className={styles.template__header}>
        <Link
          to={ROUTES.BoardNotice()}
          className={styles['template__title-link']}
          onClick={() => logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'main_notice', value: '공지사항' })}
        >
          <h1 className={styles.template__title}>공지사항</h1>
        </Link>
        <Link
          to={ROUTES.BoardNotice()}
          className={styles.template__link}
          onClick={() => logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'main_notice_detail', value: '공지사항' })}
        >
          더보기
          <RightArrow aria-hidden />
        </Link>
      </div>

      <Suspense fallback={<div />}>
        <ul className={styles.list}>
          {articles.slice(0, 7).map((article) => (
            <li key={article.id} className={styles.list__item}>
              <Link
                to={ROUTES.BoardNoticeDetail({ id: String(article.id), isLink: true })}
                className={styles['list__item-link']}
              >
                <span className={styles['list__item-type']}>
                  {getArticleType(article.board_id)}
                </span>
                <span className={styles['list__item-title']}>
                  {article.title}
                </span>
                {setArticleRegisteredDate(article.registered_at) && (
                  <img
                    className={styles['list__item-tag']}
                    src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png"
                    alt="NEW"
                    aria-hidden
                  />
                )}
              </Link>
              <span className={styles['list__item-registered']}>
                {article.registered_at.replaceAll('-', '.')}
              </span>
            </li>
          ))}
        </ul>
      </Suspense>
    </section>
  );
}

export default IndexNotice;
