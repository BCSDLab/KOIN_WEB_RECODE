import React from 'react';
import useParamsHandler from 'utils/hooks/useParamsHandler';
import useArticleList from './useArticleList';

const useBoardParams = () => {
  const { params, setParams } = useParamsHandler();
  const articleList = useArticleList(params.boardId ?? '1');

  React.useEffect(() => {
    if (params.boardId === undefined) setParams('boardId', '1', { isDelete: false, isReplace: true });
  }, [params, setParams, articleList]);

  return articleList;
};

export default useBoardParams;
