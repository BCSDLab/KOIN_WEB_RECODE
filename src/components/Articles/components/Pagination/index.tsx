import { cn } from '@bcsdlab/utils';
import usePagination from 'components/Articles/hooks/usePagination';
import styles from './Pagination.module.scss';

interface PaginationProps {
  totalPageNum: number;
}

export default function Pagination({ totalPageNum }: PaginationProps) {
  const { pages, currentPage, isFirst, isLast, movePage } = usePagination(totalPageNum);

  if (totalPageNum <= 0) return null;

  return (
    <div className={styles.pagination}>
      <button
        type="button"
        aria-label="이전 페이지로"
        className={styles.pagination__move}
        onClick={() => movePage('prev')}
        disabled={isFirst}
      >
        이전으로
      </button>

      {pages.map((pageNum) => (
        <button
          key={pageNum}
          type="button"
          onClick={() => movePage(pageNum)}
          className={cn({
            [styles['pagination__number']]: true,
            [styles['pagination__number--selected']]: currentPage === pageNum,
          })}
          aria-current={currentPage === pageNum ? 'page' : undefined}
          aria-label={`${pageNum} 페이지로 이동`}
        >
          {pageNum}
        </button>
      ))}

      <button
        type="button"
        aria-label="다음 페이지로"
        className={styles.pagination__move}
        onClick={() => movePage('next')}
        disabled={isLast}
      >
        다음으로
      </button>
    </div>
  );
}
