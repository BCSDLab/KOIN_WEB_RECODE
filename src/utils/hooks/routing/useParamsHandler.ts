import { useSearchParams } from 'react-router-dom';

const useParamsHandler = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams);

  const setParams = (
    key: string,
    value: string,
    option: {
      deleteBeforeParam?: boolean;
      replacePage?: boolean;
    } = {},
  ) => {
    const { deleteBeforeParam = false, replacePage = false } = option;

    const newSearchParams = new URLSearchParams(searchParams);

    if (deleteBeforeParam) {
      newSearchParams.delete(key);
    }

    newSearchParams.set(key, value);

    setSearchParams(newSearchParams, { replace: replacePage });
  };

  return {
    params,
    searchParams,
    setParams,
    setSearchParams,
  };
};

export default useParamsHandler;
