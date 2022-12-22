import React from 'react';
import useParamsHandler from 'utils/hooks/useParamsHandler';
import useArticleList from './useArticleList';

const useBoardParams = () => {
  const { params, setParams } = useParamsHandler();
  const articleList = useArticleList(params.page ?? '1');

  React.useEffect(() => {
    if (params.page === undefined) setParams('page', '1', { deleteBeforeParam: false, replacePage: true });
  }, [params, setParams, articleList]);

  return articleList;
};

export default useBoardParams;
