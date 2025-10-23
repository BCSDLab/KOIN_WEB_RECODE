import useParamsHandler from 'utils/hooks/routing/useParamsHandler';
import showToast from 'utils/ts/showToast';

const PAGE_LIMIT = 5;

const displayCorrectionNum = (totalPageNum: number, nowPageNum: number) => {
  if (totalPageNum <= PAGE_LIMIT) return 0;

  if (nowPageNum <= Math.ceil(PAGE_LIMIT / 2)) {
    return 0;
  }
  if (totalPageNum - nowPageNum <= Math.floor(PAGE_LIMIT / 2)) {
    return totalPageNum - PAGE_LIMIT;
  }

  return nowPageNum - Math.ceil(PAGE_LIMIT / 2);
};

const usePagination = () => {
  const { setParams } = useParamsHandler();

  const calcIndexPage = (limit: number, totalPageNum: number, page: string) => (
    String(limit + 1 + displayCorrectionNum(totalPageNum, Number(page)))
  );

  const onClickMove = (params: string) => () => setParams({
    page: params,
  }, {
    deleteBeforeParam: false,
    replacePage: true,
  });

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

  return {
    calcIndexPage,
    onClickMove,
    onHandlePrevPage,
    onHandleNextPage,
  };
};

export default usePagination;
