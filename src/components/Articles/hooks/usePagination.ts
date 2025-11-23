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

type MoveType = string | 'prev' | 'next';

const usePagination = () => {
  const { params, setParams } = useParamsHandler();

  const calcIndexPage = (limit: number, totalPageNum: number, page: string) =>
    String(limit + 1 + displayCorrectionNum(totalPageNum, Number(page)));

  const onClickMove = (move: MoveType, totalPageNum?: number) => () => {
    const currentPage = Number(params.page) || 1;
    let targetPage = currentPage;

    if (move === 'prev') {
      if (currentPage <= 1) {
        showToast('error', '첫 페이지입니다.');
        targetPage = 1;
      } else {
        targetPage = currentPage - 1;
      }
    } else if (move === 'next') {
      const maxPage = totalPageNum || 1;
      if (currentPage >= maxPage) {
        showToast('error', '마지막 페이지입니다.');
        targetPage = maxPage;
      } else {
        targetPage = currentPage + 1;
      }
    } else {
      targetPage = Number(move);
    }

    setParams(
      {
        page: String(targetPage),
      },
      {
        deleteBeforeParam: false,
        replacePage: true,
      },
    );
  };

  return {
    calcIndexPage,
    onClickMove,
  };
};

export default usePagination;
