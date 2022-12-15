import { useSearchParams } from 'react-router-dom';

const useParamsHandler = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams);
  const setParams = (
    key: string,
    value: string,
    option: {
      isDelete: boolean,
      isReplace: boolean,
    },
  ) => {
    if (option.isDelete) {
      const param = searchParams.get(key);
      if (param) {
        searchParams.delete(key);
        setSearchParams(searchParams, { replace: option.isReplace });
        return;
      }
    }
    searchParams.set(key, value);
    setSearchParams(searchParams, { replace: option.isReplace });
  };
  return {
    params,
    searchParams,
    setParams,
  };
};

export default useParamsHandler;
