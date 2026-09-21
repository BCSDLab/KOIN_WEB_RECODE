import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import type { LostItemArticleForGetDTO } from 'api/articles/entity';
import { useArticlesLogger } from 'components/Articles/hooks/useArticlesLogger';
import FoundChip from 'components/Articles/LostItemDetailPage/components/FoundChip';
import { getCategoryBadgeStyle } from 'components/Articles/utils/lostItemCategoryBadge';
import setArticleRegisteredDate from 'components/Articles/utils/setArticleRegisteredDate';
import ROUTES from 'static/routes';
import { useServerRequest } from 'utils/context/serverRequest';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import showToast from 'utils/ts/showToast';

import styles from './LostItemList.module.scss';

interface LostItemListProps {
  articles: LostItemArticleForGetDTO[];
}

type HeaderRowInfo = Record<string, string>;

const HEADER_ROW: HeaderRowInfo = {
  classification: '분류',
  title: '제목',
  author: '작성자',
  date: '날짜',
  stat: '물품 상태',
};

export default function LostItemList({ articles }: LostItemListProps) {
  // NEW 뱃지 기준일. 서버가 확정한 값이 있으면 그것을 쓴다(하이드레이션 일치).
  const serverRequest = useServerRequest();
  const referenceDate = serverRequest ? new Date(serverRequest.now) : null;
  const isMobile = useMediaQuery();
  const { logLostItemPostEntry } = useArticlesLogger();

  const handleReportedClick = () => showToast('error', '신고된 게시글은 볼 수 없습니다.');

  const getCommon = (article: LostItemArticleForGetDTO) => {
    const [registeredDate, isNewArticle] = setArticleRegisteredDate(article.registered_at, referenceDate);
    const detailLink = ROUTES.LostItemDetail({ id: String(article.id) });
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
          className={styles['lost-item-list-mobile__rowDisabled']}
          onClick={handleReportedClick}
        >
          <div className={styles['lost-item-list-mobile__type']}>{typeText}</div>

          <div className={styles['lost-item-list-mobile__title']}>
            <div className={styles['lost-item-list-mobile__titleMeta']}>
              <div className={styles['lost-item-list-mobile__reportedText']}>신고에 의해 숨김 처리 되었습니다.</div>
            </div>
            <FoundChip isFound={article.is_found} size="xs" />
          </div>

          <div className={styles['lost-item-list-mobile__writeMeta']}>
            <div className={styles['lost-item-list-mobile__author']}>{article.author}</div>
            <div className={styles['lost-item-list-mobile__dot']}>·</div>
            <div className={styles['lost-item-list-mobile__date']}>{registeredDate}</div>
          </div>
        </button>
      );
    }

    return (
      <Link
        key={article.id}
        className={styles['lost-item-list-mobile__row']}
        href={detailLink}
        onClick={() => logLostItemPostEntry(article.type === 'LOST' ? '분실물' : '습득물')}
      >
        <div className={styles['lost-item-list-mobile__type']}>{typeText}</div>

        <div className={styles['lost-item-list-mobile__title']}>
          <div className={styles['lost-item-list-mobile__titleMeta']}>
            <span className={styles['lost-item-list-mobile__badge']} style={getCategoryBadgeStyle(article.category)}>
              {article.category}
            </span>
            <div className={styles['lost-item-list-mobile__place']}>{article.found_place}</div>
            <div className={styles['lost-item-list-mobile__line']}>|</div>
            <div className={styles['lost-item-list-mobile__foundDate']}>{article.found_date}</div>
          </div>
          <FoundChip isFound={article.is_found} size="xs" />
        </div>

        <div className={styles['lost-item-list-mobile__content']}>{article.content}</div>

        <div className={styles['lost-item-list-mobile__writeMeta']}>
          <div className={styles['lost-item-list-mobile__author']}>{article.author}</div>
          <div className={styles['lost-item-list-mobile__dot']}>·</div>
          <div className={styles['lost-item-list-mobile__date']}>{registeredDate}</div>
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
          className={styles['lost-item-list__rowDisabled']}
          onClick={handleReportedClick}
        >
          <div className={styles['lost-item-list__type']}>{typeText}</div>

          <div className={styles['lost-item-list__title']}>
            <div className={styles['lost-item-list__reportedText']}>신고에 의해 숨김 처리 되었습니다.</div>
          </div>

          <div className={styles['lost-item-list__author']}>{article.author}</div>
          <div className={styles['lost-item-list__date']}>{registeredDate}</div>

          <div className={styles['lost-item-list__chip']}>
            <FoundChip isFound={article.is_found} size="xs" />
          </div>
        </button>
      );
    }

    return (
      <Link
        key={article.id}
        className={styles['lost-item-list__row']}
        href={detailLink}
        onClick={() => logLostItemPostEntry(article.type === 'LOST' ? '분실물' : '습득물')}
      >
        <div className={styles['lost-item-list__type']}>{typeText}</div>

        <div className={styles['lost-item-list__title']}>
          <div className={styles['lost-item-list__titleMeta']}>
            <span className={styles['lost-item-list__badge']} style={getCategoryBadgeStyle(article.category)}>
              {article.category}
            </span>
            <div className={styles['lost-item-list__place']}>{article.found_place}</div>
            <div>|</div>
            <div className={styles['lost-item-list__foundDate']}>{article.found_date}</div>

            {isNewArticle && (
              <Image
                className={styles['lost-item-list__newIcon']}
                src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png"
                alt="new"
                width={15}
                height={15}
              />
            )}
          </div>
        </div>

        <div className={styles['lost-item-list__author']}>{article.author}</div>
        <div className={styles['lost-item-list__date']}>{registeredDate}</div>

        <div className={styles['lost-item-list__chip']}>
          <FoundChip isFound={article.is_found} size="xs" />
        </div>
      </Link>
    );
  };

  return (
    <React.Fragment>
      <div className={styles.header}>
        <div className={styles.header__container}>
          <div className={styles.header__row}>
            {Object.keys(HEADER_ROW).map((key) => (
              <div key={key} className={styles.info}>
                {HEADER_ROW[key]}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles['lost-item-list']}>
        {articles.map((article) => (isMobile ? mobileRow(article) : desktopRow(article)))}
      </div>
    </React.Fragment>
  );
}
