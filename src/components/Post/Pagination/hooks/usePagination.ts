import useParamsHandler from 'utils/hooks/useParamsHandler';

const LIMIT_COUNT = [0, 1, 2, 3, 4];

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

const usePagination = () => {
  const { setParams } = useParamsHandler();

  const calcPageSelected = (limit: number, totalPageNum: number, boardId: number) => (
    limit + 1 + displayCorrectionNum(totalPageNum, boardId)
  );

  const onClickMove = (params: string) => setParams('boardId', params, false, true);

  return {
    calcPageSelected,
    onClickMove,
    LIMIT_COUNT,
  };
};

export default usePagination;
