import useParamsHandler from 'utils/hooks/useParamsHandler';

const usePageParams = () => {
  const { params, setParams } = useParamsHandler();

  if (params.page === undefined) {
    setParams('page', '1', { deleteBeforeParam: false, replacePage: true });
  }

  return params.page ?? '1';
};

export default usePageParams;
