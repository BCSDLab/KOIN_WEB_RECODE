import useParamsHandler from 'utils/hooks/useParamsHandler';

const usePageParams = () => {
  const { params } = useParamsHandler();

  return params.page ?? '1';
};

export default usePageParams;
