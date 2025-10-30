import Link from 'next/link';
import { Article } from 'api/articles/entity';
import { convertArticlesTag } from 'components/Articles/utils/convertArticlesTag';
import setArticleRegisteredDate from 'components/Articles/utils/setArticleRegisteredDate';
import ROUTES from 'static/routes';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import showToast from 'utils/ts/showToast';
import styles from './ArticleList.module.scss';

interface ArticleListProps {
  articles: Article[];
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
        const { type, content, date } = parseLostItemTitle(article.title);
        const registeredDate = setArticleRegisteredDate(article.registered_at)[0];
        const isNewArticle = setArticleRegisteredDate(article.registered_at)[1];

        // 1. 신고된 게시글 (클릭 X, 토스트메시지, 내용 표시 다르게)
        if (article.board_id === 14 && article.is_reported) {
          return (
            <div
              key={article.id}
              className={`${styles.list__link} ${styles.disabled}`}
              role="button"
              onClick={() => showToast('error', '신고된 게시글은 더 이상 볼 수 없습니다.')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  showToast('error', '신고된 게시글은 더 이상 볼 수 없습니다.');
                }
              }}
              tabIndex={0}
            >
              <div className={styles.list__id}>{article.id}</div>
              <div className={styles.title}>
                <div className={styles.title__container}>
                  <div className={styles['title__container-header']}>{convertArticlesTag(article.board_id)}</div>
                  <div>신고에 의해 숨김 처리 되었습니다.</div>
                </div>
              </div>
              <div className={styles.list__author}>{isMobile ? `${article.author}` : article.author}</div>
              <div className={styles['list__registered-at']}>{registeredDate}</div>
            </div>
          );
        }

        // 2. 신고되지 않은 게시글 (클릭 O, 상세페이지로 이동)
        return (
          <Link className={styles.list__link} href={getLink(article)} key={article.id}>
            <div className={styles.list__id}>{article.id}</div>
            <div className={styles.title}>
              <div className={styles.title__container}>
                <div className={styles['title__container-header']}>{convertArticlesTag(article.board_id)}</div>
                {/* 분실물 */}
                {article.board_id === 14 ? (
                  <>
                    <div className={styles['title__container-type']}>{type}</div>
                    <div className={styles['title__container-container']}>{content}</div>
                    <div className={styles['title__container-container']}>|</div>
                    <div className={styles['title__container-container']}>{date}</div>
                    {isNewArticle && (
                      <img
                        className={styles['title__new-tag']}
                        src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png"
                        alt="new"
                      />
                    )}
                  </>
                ) : (
                  <>
                    {/* 일반 공지사항 */}
                    <div className={styles.title__content}>{article.title}</div>
                    {isNewArticle && (
                      <img
                        className={styles['title__new-tag']}
                        src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png"
                        alt="new"
                      />
                    )}
                  </>
                )}
              </div>
            </div>
            <div className={styles.list__author}>
              <div className={styles.list__author__content}>{isMobile ? `${article.author}` : article.author}</div>
            </div>
            <div className={styles['list__registered-at']}>{setArticleRegisteredDate(article.registered_at)[0]}</div>
          </Link>
        );
      })}
    </div>
  );
}
