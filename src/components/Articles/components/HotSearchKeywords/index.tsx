import styles from './HotSearchKeywords.module.scss';

interface HotSearchKeywordsProps {
  keywords: string[];
  onKeywordClick: (keyword: string) => void;
}

export default function HotSearchKeywords({ keywords, onKeywordClick }: HotSearchKeywordsProps) {
  if (keywords.length === 0) return null;

  return (
    <div className={styles.section}>
      <p className={styles.section__title}>많이 검색되는 키워드</p>
      <div className={styles.section__chips}>
        {keywords.map((keyword) => (
          <button
            key={keyword}
            type="button"
            className={styles.chip}
            onClick={() => onKeywordClick(keyword)}
          >
            {`#${keyword}`}
          </button>
        ))}
      </div>
    </div>
  );
}
