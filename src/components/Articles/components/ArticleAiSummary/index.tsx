import { cn } from '@bcsdlab/utils';
import AiSummaryIcon from 'assets/svg/Articles/ai-summary.svg';
import type { ArticleAiSummary as ArticleAiSummaryData } from 'api/articles/entity';
import styles from './ArticleAiSummary.module.scss';

interface ArticleAiSummaryProps {
  aiSummary: ArticleAiSummaryData;
}

export default function ArticleAiSummary({ aiSummary }: ArticleAiSummaryProps) {
  const isNonSuccessStatus = aiSummary.status !== 'SUCCESS';

  return (
    <section
      className={cn({
        [styles.container]: true,
        [styles['container--message']]: isNonSuccessStatus,
      })}
      aria-labelledby="article-ai-summary-title"
    >
      <div className={styles.heading}>
        <h2 id="article-ai-summary-title" className={styles.heading__title}>
          AI 요약
        </h2>
        <AiSummaryIcon className={styles['heading__ai-icon']} aria-hidden />
      </div>

      {aiSummary.status === 'SUCCESS' && (
        <ul className={styles.list}>
          {aiSummary.items.map((item) => (
            <li key={`${item.icon}-${item.text}`} className={styles.list__item}>
              <span className={styles.list__icon} aria-hidden>
                {item.icon}
              </span>
              <span className={styles.list__text}>{item.text}</span>
            </li>
          ))}
        </ul>
      )}

      {isNonSuccessStatus && (
        <p className={styles.message}>{aiSummary.status === 'PENDING' ? '요약중...' : '요약할 내용이 없어요.'}</p>
      )}
    </section>
  );
}
