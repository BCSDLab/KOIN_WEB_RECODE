import Image from 'next/image';
import Link from 'next/link';
import { LostItemArticleForGetDTO } from 'api/articles/entity';
import setArticleRegisteredDate from 'components/Articles/utils/setArticleRegisteredDate';
import ROUTES from 'static/routes';
import showToast from 'utils/ts/showToast';
import styles from './LostItemList.module.scss';

interface LostItemListProps {
  articles: LostItemArticleForGetDTO[];
}

export default function LostItemList({ articles }: LostItemListProps) {
  return (
    <div className={styles.lostItemList}>
      {articles.map((article) => {
        const [registeredDate, isNewArticle] = setArticleRegisteredDate(article.registered_at);
        const detailLink = ROUTES.LostItemDetail({ id: String(article.id), isLink: true });

        if (article.is_reported) {
          return (
            <button
              key={article.id}
              type="button"
              className={styles.lostItemList__rowDisabled}
              onClick={() => showToast('error', '신고된 게시글은 볼 수 없습니다.')}
            >
              <div className={styles.lostItemList__type}>{article.id}</div>

              <div className={styles.lostItemList__title}>
                <div className={styles.lostItemList__reportedText}>신고에 의해 숨김 처리 되었습니다.</div>
              </div>

              <div className={styles.lostItemList__author}>{article.author}</div>
              <div className={styles.lostItemList__date}>{registeredDate}</div>

              {/* 5열 그리드 유지하기 위한 div입니다. */}
              <div className={styles.lostItemList__status} />
            </button>
          );
        }

        return (
          <Link key={article.id} className={styles.lostItemList__row} href={detailLink}>
            <div className={styles.lostItemList__type}>{article.type === 'LOST' ? '분실물' : '습득물'}</div>

            <div className={styles.lostItemList__title}>
              <div className={styles.lostItemList__titleMeta}>
                <span className={styles.lostItemList__badge}>{article.category}</span>
                <div className={styles.lostItemList__place}>{article.found_place}</div>
                <div className={styles.lostItemList__foundDate}>{article.found_date}</div>

                {isNewArticle && (
                  <Image
                    className={styles.lostItemList__newIcon}
                    src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png"
                    alt="new"
                    width={15}
                    height={15}
                  />
                )}
              </div>
            </div>

            <div className={styles.lostItemList__author}>{article.author}</div>
            <div className={styles.lostItemList__date}>{registeredDate}</div>
            <div className={styles.lostItemList__status}>찾는중</div>
          </Link>
        );
      })}
    </div>
  );
}
