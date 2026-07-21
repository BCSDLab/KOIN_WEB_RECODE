import { useMemo } from 'react';
import useParamsHandler from 'utils/hooks/routing/useParamsHandler';

const PAGE_LIMIT = 5;

const usePagination = (totalPageNum: number) => {
  const { params, setParams } = useParamsHandler();

  const raw = Number(params.page) || 1;
  const currentPage = Math.min(Math.max(raw, 1), Math.max(totalPageNum, 1));

  const pages = useMemo(() => {
    const half = Math.floor(PAGE_LIMIT / 2);
    const maxStart = Math.max(1, totalPageNum - PAGE_LIMIT + 1);
    const startPage = Math.min(Math.max(1, currentPage - half), maxStart);
    const length = Math.min(PAGE_LIMIT, totalPageNum);

    return Array.from({ length }, (_, i) => startPage + i);
  }, [currentPage, totalPageNum]);

  const movePage = (target: number | 'prev' | 'next') => {
    let nextPage = currentPage;

    if (target === 'prev') nextPage = Math.max(1, currentPage - 1);
    else if (target === 'next') nextPage = Math.min(totalPageNum, currentPage + 1);
    else nextPage = target;

    if (nextPage === currentPage) return;

    setParams({ page: String(nextPage) }, { replacePage: true });
  };

  return {
    pages,
    currentPage,
    isFirst: currentPage <= 1,
    isLast: currentPage >= totalPageNum,
    movePage,
  };
};

export default usePagination;
