import { cn } from '@bcsdlab/utils';
import useParamsHandler from 'utils/hooks/routing/useParamsHandler';
import usePagination from 'components/Articles/hooks/usePagination';
import styles from './Pagination.module.scss';

const LIMIT_COUNT = [0, 1, 2, 3, 4];

interface PaginationProps {
  totalPageNum: number
}

export default function Pagination({ totalPageNum }: PaginationProps) {
  const { calcIndexPage, onClickMove } = usePagination();
  const { params } = useParamsHandler();

  const raw = Number(params.page) || 1;
  const currentPage = Math.min(Math.max(raw, 1), Math.max(totalPageNum, 1));
  const totalPage = Array.from({ length: totalPageNum || 0 }, (_, i) => i + 1);

  return (
    <div className={styles.pagination}>
      <button
        type="button"
        aria-label="이전 페이지로"
        className={styles.pagination__move}
        onClick={onClickMove('prev', totalPageNum)}
      >
        이전으로
      </button>
      {
        LIMIT_COUNT.length - 1 < totalPageNum ? (
          LIMIT_COUNT.map((limit) => (
            <span key={limit}>
              <button
                type="button"
                aria-label="페이지 이동"
                className={cn({
                  [styles.pagination__number]: true,
                  [styles['pagination__number--selected']]: (!params.page && limit === 0) || params.page === calcIndexPage(limit, totalPageNum, params.page),
                })}
                onClick={onClickMove(calcIndexPage(limit, totalPageNum, params.page ?? '1'))}
              >
                { calcIndexPage(limit, totalPageNum, params.page ?? '1')}
              </button>
            </span>
          ))
        ) : (
          totalPage.map((limit) => (
            <span key={limit + 1}>
              <button
                type="button"
                aria-label="페이지 이동"
                className={cn({
                  [styles.pagination__number]: true,
                  [styles['pagination__number--selected']]: Number(currentPage) === limit + 1,
                })}
                onClick={onClickMove(String(limit + 1), totalPageNum)}
              >
                { limit + 1 }
              </button>
            </span>
          ))
        )
      }
      <button
        type="button"
        aria-label="다음 페이지로"
        className={styles.pagination__move}
        onClick={onClickMove('next', totalPageNum)}
      >
        다음으로
      </button>
    </div>
  );
}
