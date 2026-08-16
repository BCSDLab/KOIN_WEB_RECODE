import AiSummaryIcon from 'assets/svg/Articles/ai-summary.svg';
import type { ArticleAiSummary as ArticleAiSummaryData } from 'api/articles/entity';
import styles from './ArticleAiSummary.module.scss';

interface ArticleAiSummaryProps {
  aiSummary: ArticleAiSummaryData;
}

export default function ArticleAiSummary({ aiSummary }: ArticleAiSummaryProps) {
  const isMessageState = aiSummary.status !== 'SUCCESS';

  return (
    <section
      className={`${styles.container} ${isMessageState ? styles.messageContainer : ''}`}
      aria-labelledby="article-ai-summary-title"
    >
      <div className={styles.heading}>
        <h2 id="article-ai-summary-title" className={styles.title}>
          AI 요약
        </h2>
        <AiSummaryIcon className={styles.aiIcon} aria-hidden />
      </div>

      {aiSummary.status === 'SUCCESS' && (
        <ul className={styles.list}>
          {aiSummary.items.map((item) => (
            <li key={`${item.icon}-${item.text}`} className={styles.item}>
              <span className={styles.icon} aria-hidden>
                {item.icon}
              </span>
              <span className={styles.text}>{item.text}</span>
            </li>
          ))}
        </ul>
      )}

      {aiSummary.status === 'PENDING' && <p className={styles.message}>요약중...</p>}

      {aiSummary.status === 'UNAVAILABLE' && <p className={styles.message}>요약할 내용이 없어요.</p>}
    </section>
  );
}
