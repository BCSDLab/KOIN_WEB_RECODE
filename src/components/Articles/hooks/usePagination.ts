import useParamsHandler from 'utils/hooks/routing/useParamsHandler';

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

  return {
    calcIndexPage,
    onClickMove,
  };
};

export default usePagination;
