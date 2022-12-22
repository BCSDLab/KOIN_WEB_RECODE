import React from 'react';
import cn from 'utils/ts/classnames';
import showToast from 'utils/ts/showToast';
import useParamsHandler from 'utils/hooks/useParamsHandler';
import usePagination from './hooks/usePagination';
import styles from './Pagination.module.scss';

const LIMIT_COUNT = [0, 1, 2, 3, 4];

interface PaginationProps {
  totalPageNum: number
}

const changeParamsToNumber = (params: string) => {
  if (params === undefined) {
    return 1;
  }
  return Number(params);
};

const movePrevNumber = (moveNumber: number) => {
  if (moveNumber <= 0) {
    showToast('error', '첫 페이지입니다.');
    return '1';
  }

  return String(moveNumber);
};

const moveNextNumber = (moveNumber: number, totalPageNum: number) => {
  if (moveNumber + 1 >= totalPageNum) {
    showToast('error', '마지막 페이지입니다.');
    return String(totalPageNum);
  }

  return String(moveNumber);
};

function Pagination(props: PaginationProps) {
  const { calcIndexPage, onClickMove } = usePagination();
  const { params, setParams } = useParamsHandler();
  const { totalPageNum } = props;

  return (
    <div className={styles.pagination}>
      <button
        type="button"
        aria-label="page-index-prev"
        className={styles.pagination__move}
        onClick={() => onClickMove(movePrevNumber(Number(params.boardId) - 1))}
      >
        이전으로
      </button>
      {
        LIMIT_COUNT.length - 1 < totalPageNum ? (
          LIMIT_COUNT.map((limit) => (
            <span key={limit}>
              <button
                type="button"
                aria-label="page-index-button"
                className={cn({
                  [styles.pagination__number]: true,
                  [styles['pagination__number--selected']]: params.boardId === calcIndexPage(limit, totalPageNum, params.boardId),
                })}
                onClick={() => onClickMove(calcIndexPage(limit, totalPageNum, params.boardId))}
              >
                { calcIndexPage(limit, totalPageNum, params.boardId)}
              </button>
            </span>
          ))
        ) : (
          [...Array(totalPageNum)].map((limit) => (
            <span key={limit + 1}>
              <button
                type="button"
                aria-label="page-index-button"
                className={cn({
                  [styles.pagination__number]: true,
                  [styles['pagination__number--selected']]: changeParamsToNumber(params.boardId) === limit + 1,
                })}
                onClick={() => onClickMove(String(limit + 1))}
              >
                { limit + 1 }
              </button>
            </span>
          ))
        )
      }
      <button
        type="button"
        aria-label="page-index-next"
        className={styles.pagination__move}
        onClick={() => setParams('boardId', moveNextNumber(Number(params.boardId) + 1, Number(totalPageNum)), { deleteBeforeParam: false, replacePage: true })}
      >
        다음으로
      </button>
    </div>
  );
}

export default Pagination;
