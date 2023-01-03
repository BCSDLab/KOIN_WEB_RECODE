import { useSearchParams } from 'react-router-dom';

const useParamsHandler = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams);
  const setParams = (
    key: string,
    value: string,
    option: {
      deleteBeforeParam: boolean,
      replacePage: boolean,
    },
  ) => {
    if (option.deleteBeforeParam) {
      const param = searchParams.get(key);
      if (param) {
        searchParams.delete(key);
        setSearchParams(searchParams, { replace: option.replacePage });
        return;
      }
    }
    searchParams.set(key, value);
    setSearchParams(searchParams, { replace: option.replacePage });
  };
  return {
    params,
    searchParams,
    setParams,
  };
};

export default useParamsHandler;
