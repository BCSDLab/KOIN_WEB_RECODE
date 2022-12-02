import { useSearchParams } from 'react-router-dom';

const useParamsHandler = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams);
  const setParams = (key: string, value: string, isDelete: boolean) => {
    if (isDelete) {
      const param = searchParams.get(key);
      if (param) {
        searchParams.delete(key);
        setSearchParams(searchParams, { replace: true });
        return;
      }
    }
    searchParams.set(key, value);
    setSearchParams(searchParams, { replace: true });
  };
  return {
    params,
    searchParams,
    setParams,
  };
};

export default useParamsHandler;
