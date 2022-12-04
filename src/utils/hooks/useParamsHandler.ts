import { useSearchParams } from 'react-router-dom';

const useParamsHandler = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams);
  const setParams = (key: string, value: string, isDelete: boolean, replaceOption: boolean) => {
    if (isDelete) {
      const param = searchParams.get(key);
      if (param) {
        searchParams.delete(key);
        setSearchParams(searchParams, { replace: replaceOption });
        return;
      }
    }
    searchParams.set(key, value);
    setSearchParams(searchParams, { replace: replaceOption });
  };
  return {
    params,
    searchParams,
    setParams,
  };
};

export default useParamsHandler;
