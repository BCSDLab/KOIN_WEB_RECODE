import Image from 'next/image';
import Link from 'next/link';
import { LostItemArticleForGetDTO } from 'api/articles/entity';
import setArticleRegisteredDate from 'components/Articles/utils/setArticleRegisteredDate';
import ROUTES from 'static/routes';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import showToast from 'utils/ts/showToast';
import styles from './LostItemList.module.scss';

interface LostItemListProps {
  articles: LostItemArticleForGetDTO[];
}

export default function LostItemList({ articles }: LostItemListProps) {
  const isMobile = useMediaQuery();

  return (
    <div className={styles.list}>
      {articles.map((article) => {
        const [registeredDate, isNewArticle] = setArticleRegisteredDate(article.registered_at);
        const detailLink = ROUTES.LostItemDetail({ id: String(article.id), isLink: true });

        if (article.is_reported) {
          return (
            <button
              key={article.id}
              className={`${styles.list__link} ${styles.disabled}`}
              onClick={() => showToast('error', '신고된 게시글은 볼 수 없습니다.')}
            >
              <div className={styles.list__id}>{article.id}</div>
              <div className={styles.title}>
                <div className={styles.title__container}>
                  <div className={styles.reported_text}>신고에 의해 숨김 처리 되었습니다.</div>
                </div>
              </div>
              <div className={styles.list__author}>{article.author}</div>
              <div className={styles['list__registered-at']}>{registeredDate}</div>
            </button>
          );
        }

        return (
          <Link className={styles.list__link} href={detailLink} key={article.id}>
            <div className={styles.list__id}>{article.id}</div>
            <div className={styles.title}>
              <div className={styles.title__container}>
                <span className={styles.category_tag}>{article.category}</span>
                <div className={styles['title__container-type']}>[{article.type === 'LOST' ? '분실' : '습득'}]</div>
                <div className={styles.content_main}>{article.content}</div>
                {isNewArticle && (
                  <Image
                    src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png"
                    alt="new"
                    width={15}
                    height={15}
                  />
                )}
              </div>
            </div>
            <div className={styles.list__author}>{article.author}</div>
            <div className={styles['list__registered-at']}>{registeredDate}</div>
          </Link>
        );
      })}
    </div>
  );
}
