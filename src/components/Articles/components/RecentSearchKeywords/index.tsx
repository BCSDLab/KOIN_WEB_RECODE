import CloseIcon from 'assets/svg/Articles/close.svg';
import styles from './RecentSearchKeywords.module.scss';

interface RecentSearchKeywordsProps {
  keywords: string[];
  onKeywordClick: (keyword: string) => void;
  onKeywordRemove: (keyword: string) => void;
  onClearAll: () => void;
}

export default function RecentSearchKeywords({
  keywords,
  onKeywordClick,
  onKeywordRemove,
  onClearAll,
}: RecentSearchKeywordsProps) {
  if (keywords.length === 0) return null;

  return (
    <div className={styles.section}>
      <div className={styles.section__header}>
        <p className={styles.section__title}>최근 검색기록</p>
        <button type="button" className={styles.section__clear} onClick={onClearAll}>
          전체 삭제
        </button>
      </div>
      <ul className={styles.list}>
        {keywords.map((keyword) => (
          <li key={keyword} className={styles.item}>
            <button type="button" className={styles.item__keyword} onClick={() => onKeywordClick(keyword)}>
              {keyword}
            </button>
            <button
              type="button"
              className={styles.item__remove}
              onClick={() => onKeywordRemove(keyword)}
              aria-label={`${keyword} 삭제`}
            >
              <CloseIcon />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
