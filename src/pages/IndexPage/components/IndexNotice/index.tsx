import { Link } from 'react-router-dom';
import { ReactComponent as RightArrow } from 'assets/svg/right-arrow.svg';
import useArticleList from 'pages/Notice/NoticeListPage/hooks/useArticleList';
import useLogger from 'utils/hooks/useLogger';
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

const isNew = (createdAt: string) => {
  const now = new Date();
  const created = new Date(createdAt);

  return (now.getTime() - created.getTime()) < 1000 * 60 * 60 * 24 * 1;
};

function IndexNotice() {
  const articleList = useArticleList('1');
  const logger = useLogger();

  return (
    <section className={styles.template}>
      <div className={styles.template__header}>
        <Link
          to="board/notice"
          className={styles['template__title-link']}
          onClick={() => logger.actionEventClick({
            actionTitle: 'CAMPUS',
            title: 'main_notice',
            value: '공지사항',
          })}
        >
          <h1 className={styles.template__title}>공지사항</h1>
        </Link>
        <Link
          to="/board/notice"
          className={styles.template__link}
          onClick={() => logger.actionEventClick({
            actionTitle: 'CAMPUS',
            title: 'main_notice_detail',
            value: '공지사항',
          })}
        >
          더보기
          <RightArrow aria-hidden />
        </Link>
      </div>

      {articleList && (
        <ul className={styles.list}>
          {articleList.articles.slice(0, 7).map((article) => (
            <li key={article.id} className={styles.list__item}>
              <Link
                to={`/board/notice/${article.id}`}
                className={styles['list__item-link']}
              >
                <span className={styles['list__item-type']}>
                  {getArticleType(article.board_id)}
                </span>
                <span className={styles['list__item-title']}>
                  {article.title}
                </span>
                {isNew(article.created_at) && (
                  <img
                    className={styles['list__item-tag']}
                    src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png"
                    alt="NEW"
                    aria-hidden
                  />
                )}
              </Link>
              <span className={styles['list__item-created']}>
                {article.created_at
                  ? article.created_at.slice(0, 10).replaceAll('-', '.')
                  : '날짜 정보 없음'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default IndexNotice;
