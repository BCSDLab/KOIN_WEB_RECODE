import cn from 'utils/ts/classnames';
import showToast from 'utils/ts/showToast';
import useParamsHandler from 'utils/hooks/useParamsHandler';
import usePagination from './hooks/usePagination';
import styles from './Pagination.module.scss';

const LIMIT_COUNT = [0, 1, 2, 3, 4];

interface PaginationProps {
  totalPageNum: number
}

export const changeParamsToNumber = (params: string) => {
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
  const { calcPageSelected, onClickMove } = usePagination();
  const { params, setParams } = useParamsHandler();
  const { totalPageNum } = props;

  return (
    <div className={styles.pagination}>
      <button
        type="button"
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
                className={cn({
                  [styles.pagination__number]: true,
                  [styles['page-number--selected']]: changeParamsToNumber(params.boardId) === (
                    calcPageSelected(limit, totalPageNum, changeParamsToNumber(params.boardId))
                  ),
                })}
                onClick={() => {
                  onClickMove(String(calcPageSelected(
                    limit,
                    totalPageNum,
                    changeParamsToNumber(params.boardId),
                  )));
                }}
              >
                { calcPageSelected(limit, totalPageNum, changeParamsToNumber(params.boardId)) }
              </button>
            </span>
          ))
        ) : (
          [...Array(totalPageNum)].map((limit, index) => (
            <span key={limit}>
              <button
                type="button"
                className={cn({
                  [styles.pagination__number]: true,
                  [styles['page-number--selected']]: changeParamsToNumber(params.boardId) === index + 1,
                })}
                onClick={() => onClickMove(String(index + 1))}
              >
                { index + 1 }
              </button>
            </span>
          ))
        )
      }
      <button
        type="button"
        className={styles.pagination__move}
        onClick={() => setParams('boardId', moveNextNumber(Number(params.boardId) + 1, Number(totalPageNum)), false, false)}
      >
        다음으로
      </button>
    </div>
  );
}

export default Pagination;
