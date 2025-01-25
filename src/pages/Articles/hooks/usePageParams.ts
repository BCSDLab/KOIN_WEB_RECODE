import useParamsHandler from 'utils/hooks/routing/useParamsHandler';

const usePageParams = () => {
  const { params } = useParamsHandler();

  return params.page ?? '1';
};

export default usePageParams;
