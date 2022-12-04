import cn from 'utils/ts/classnames';
import showToast from 'utils/ts/showToast';
import useParamsHandler from 'pages/Notice/hooks/useParamsHandler';
import styles from './PageNation.module.scss';

interface PageNationProps {
  totalPageNum: number
  nowPageNum: number
}

const LIMIT_COUNT = [0, 1, 2, 3, 4];

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

const displayCorrectionNum = (totalPageNum: number, nowPageNum: number) => {
  if (totalPageNum <= LIMIT_COUNT.length) return 0;

  if (nowPageNum <= Math.ceil(LIMIT_COUNT.length / 2)) {
    return 0;
  }
  if (totalPageNum - nowPageNum <= Math.floor(LIMIT_COUNT.length / 2)) {
    return totalPageNum - LIMIT_COUNT.length;
  }

  return nowPageNum - Math.ceil(LIMIT_COUNT.length / 2);
};

function PageNation(props: PageNationProps) {
  const { params, setParams } = useParamsHandler();
  const { totalPageNum, nowPageNum } = props;

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles['move-pageSection']}
        onClick={() => setParams('boardId', movePrevNumber(Number(params.boardId) - 1), false)}
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
                  [styles['page-number']]: true,
                  [styles['page-number--selected']]: nowPageNum === (
                    limit + 1 + displayCorrectionNum(totalPageNum, nowPageNum)
                  ),
                })}
                onClick={() => setParams('boardId', String(limit + 1 + displayCorrectionNum(totalPageNum, nowPageNum)), false)}
              >
                { limit + 1 + displayCorrectionNum(totalPageNum, nowPageNum) }
              </button>
            </span>
          ))
        ) : (
          [...Array(totalPageNum)].map((limit, index) => (
            <span key={limit}>
              <button
                type="button"
                className={cn({
                  [styles['page-number']]: true,
                  [styles['page-number--selected']]: nowPageNum === index + 1,
                })}
                onClick={() => setParams('boardId', String(index + 1), false)}
              >
                { index + 1 }
              </button>
            </span>
          ))
        )
      }
      <button
        type="button"
        className={styles['move-pageSection']}
        onClick={() => setParams('boardId', moveNextNumber(Number(params.boardId) + 1, Number(totalPageNum)), false)}
      >
        다음으로
      </button>
    </div>
  );
}

export default PageNation;
