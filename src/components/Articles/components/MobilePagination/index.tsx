import { cn } from '@bcsdlab/utils';
import usePagination from 'components/Articles/hooks/usePagination';
import styles from './MobilePagination.module.scss';

interface MobilePaginationProps {
  totalPageNum: number;
}

export default function MobilePagination({ totalPageNum }: MobilePaginationProps) {
  const { pages, currentPage, isFirst, isLast, movePage } = usePagination(totalPageNum);

  if (totalPageNum <= 0) return null;

  return (
    <div className={styles.pagination}>
      <button
        type="button"
        aria-label="이전 페이지로"
        className={styles.pagination__prev}
        onClick={() => movePage('prev')}
        disabled={isFirst}
      >
        {!isFirst && '이전'}
      </button>

      <div className={styles.pagination__pages}>
        {pages.map((pageNum) => (
          <button
            key={pageNum}
            type="button"
            onClick={() => movePage(pageNum)}
            className={cn({
              [styles.pagination__btn]: true,
              [styles['pagination__btn--active']]: currentPage === pageNum,
            })}
            aria-current={currentPage === pageNum ? 'page' : undefined}
            aria-label={`${pageNum} 페이지로 이동`}
          >
            {pageNum}
          </button>
        ))}
      </div>

      <button
        type="button"
        aria-label="다음 페이지로"
        className={styles.pagination__next}
        onClick={() => movePage('next')}
        disabled={isLast}
      >
        {!isLast && '다음'}
      </button>
    </div>
  );
}
