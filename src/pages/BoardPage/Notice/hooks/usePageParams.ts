import React from 'react';
import useParamsHandler from 'utils/hooks/useParamsHandler';

const usePageParams = () => {
  const { params, setParams } = useParamsHandler();

  React.useEffect(() => {
    if (params.page === undefined) setParams('page', '1', { deleteBeforeParam: false, replacePage: true });
  }, [params, setParams]);

  return params.page;
};

export default usePageParams;
