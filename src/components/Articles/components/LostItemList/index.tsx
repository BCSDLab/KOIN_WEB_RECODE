import Image from 'next/image';
import Link from 'next/link';
import { LostItemArticleForGetDTO } from 'api/articles/entity';
import { useArticlesLogger } from 'components/Articles/hooks/useArticlesLogger';
import FoundChip from 'components/Articles/LostItemDetailPage/components/FoundChip';
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
  const { logLostItemPostEntry } = useArticlesLogger();

  const handleReportedClick = () => showToast('error', '신고된 게시글은 볼 수 없습니다.');

  const getCommon = (article: LostItemArticleForGetDTO) => {
    const [registeredDate, isNewArticle] = setArticleRegisteredDate(article.registered_at);
    const detailLink = ROUTES.LostItemDetail({ id: String(article.id), isLink: true });
    const typeText = article.type === 'LOST' ? '분실물' : '습득물';

    return { registeredDate, isNewArticle, detailLink, typeText };
  };

  const mobileRow = (article: LostItemArticleForGetDTO) => {
    const { registeredDate, detailLink, typeText } = getCommon(article);

    if (article.is_reported) {
      return (
        <button
          key={article.id}
          type="button"
          className={styles.lostItemList__rowDisabled}
          onClick={handleReportedClick}
        >
          <div className={styles.lostItemListMobile__type}>{typeText}</div>

          <div className={styles.lostItemListMobile__title}>
            <div className={styles.lostItemListMobile__titleMeta}>
              <div className={styles.lostItemList__reportedText}>신고에 의해 숨김 처리 되었습니다.</div>
            </div>
            <FoundChip isFound={article.is_found} size="xs" />
          </div>

          <div className={styles.lostItemListMobile__writeMeta}>
            <div className={styles.lostItemListMobile__author}>{article.author}</div>
            <div className={styles.lostItemListMobile__dot}>·</div>
            <div className={styles.lostItemListMobile__date}>{registeredDate}</div>
          </div>
        </button>
      );
    }

    return (
      <Link
        key={article.id}
        className={styles.lostItemListMobile__row}
        href={detailLink}
        onClick={() => logLostItemPostEntry(article.type === 'LOST' ? '분실물' : '습득물')}
      >
        <div className={styles.lostItemListMobile__type}>{typeText}</div>

        <div className={styles.lostItemListMobile__title}>
          <div className={styles.lostItemListMobile__titleMeta}>
            <span className={styles.lostItemListMobile__badge}>{article.category}</span>
            <div className={styles.lostItemListMobile__place}>{article.found_place}</div>
            <div className={styles.lostItemListMobile__foundDate}>{article.found_date}</div>
          </div>
          <FoundChip isFound={article.is_found} size="xs" />
        </div>

        <div className={styles.lostItemListMobile__content}>{article.content}</div>

        <div className={styles.lostItemListMobile__writeMeta}>
          <div className={styles.lostItemListMobile__author}>{article.author}</div>
          <div className={styles.lostItemListMobile__dot}>·</div>
          <div className={styles.lostItemListMobile__date}>{registeredDate}</div>
        </div>
      </Link>
    );
  };

  const desktopRow = (article: LostItemArticleForGetDTO) => {
    const { registeredDate, isNewArticle, detailLink, typeText } = getCommon(article);

    if (article.is_reported) {
      return (
        <button
          key={article.id}
          type="button"
          className={styles.lostItemList__rowDisabled}
          onClick={handleReportedClick}
        >
          <div className={styles.lostItemList__type}>{typeText}</div>

          <div className={styles.lostItemList__title}>
            <div className={styles.lostItemList__reportedText}>신고에 의해 숨김 처리 되었습니다.</div>
          </div>

          <div className={styles.lostItemList__author}>{article.author}</div>
          <div className={styles.lostItemList__date}>{registeredDate}</div>

          <div className={styles.lostItemList__chip}>
            <FoundChip isFound={article.is_found} size="xs" />
          </div>
        </button>
      );
    }

    return (
      <Link
        key={article.id}
        className={styles.lostItemList__row}
        href={detailLink}
        onClick={() => logLostItemPostEntry(article.type === 'LOST' ? '분실물' : '습득물')}
      >
        <div className={styles.lostItemList__type}>{typeText}</div>

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

        <div className={styles.lostItemList__chip}>
          <FoundChip isFound={article.is_found} size="xs" />
        </div>
      </Link>
    );
  };

  return (
    <div className={styles.lostItemList}>
      {articles.map((article) => (isMobile ? mobileRow(article) : desktopRow(article)))}
    </div>
  );
}
