import React from 'react';
import { cn } from '@bcsdlab/utils';
import showToast from 'utils/ts/showToast';
import useParamsHandler from 'utils/hooks/routing/useParamsHandler';
import usePagination from './hooks/usePagination';
import styles from './Pagination.module.scss';

const LIMIT_COUNT = [0, 1, 2, 3, 4];

const onHandlePrevPage = (moveNumber: number) => {
  if (moveNumber <= 0) {
    showToast('error', '첫 페이지입니다.');
    return '1';
  }

  return String(moveNumber);
};

const onHandleNextPage = (moveNumber: number, totalPageNum: number) => {
  if (moveNumber + 1 >= totalPageNum) {
    showToast('error', '마지막 페이지입니다.');
    return String(totalPageNum);
  }

  return String(moveNumber);
};

interface PaginationProps {
  totalPageNum: number
}

function Pagination(props: PaginationProps) {
  const { calcIndexPage, onClickMove } = usePagination();
  const { params, setParams } = useParamsHandler();
  const [currentPage, setCurrentPage] = React.useState(Number(params.page) || 1);
  const { totalPageNum } = props;
  const totalPage = Array.from({ length: totalPageNum ?? 5 }, (v, i) => i + 1);

  React.useEffect(() => {
    setCurrentPage(Number(params.page) || 1);
  }, [params.page]);

  const handlePageChange = (newPage: String) => {
    setCurrentPage(Number(newPage));
    onClickMove(String(newPage));
  };

  return (
    <div className={styles.pagination}>
      <button
        type="button"
        aria-label="이전 페이지로"
        className={styles.pagination__move}
        onClick={() => onClickMove(onHandlePrevPage(Number(params.page) - 1))}
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
                  [styles['pagination__number--selected']]: params.page === calcIndexPage(limit, totalPageNum, params.page),
                })}
                onClick={() => onClickMove(calcIndexPage(limit, totalPageNum, params.page ?? '1'))}
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
                onClick={() => handlePageChange(String(limit + 1))}
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
        onClick={() => setParams('page', onHandleNextPage(Number(params.page) + 1, Number(totalPageNum)), { deleteBeforeParam: false, replacePage: true })}
      >
        다음으로
      </button>
    </div>
  );
}

export default Pagination;
