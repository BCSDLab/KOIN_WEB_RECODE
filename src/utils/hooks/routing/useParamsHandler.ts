import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';

const useParamsHandler = () => {
  const router = useRouter();

  // URLSearchParams 형태로 제공
  const searchParams = useMemo(() => {
    if (typeof window === 'undefined') return new URLSearchParams();
    const queryString = router.asPath.split('?')[1] || '';
    return new URLSearchParams(queryString);
  }, [router.asPath]);

  const params = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);

  const setParams = useCallback(
    (
      newParams: Record<string, string | undefined>,
      option: { deleteBeforeParam?: boolean; replacePage?: boolean } = {},
    ) => {
      const { deleteBeforeParam = false, replacePage = false } = option;
      const updatedParams = new URLSearchParams(searchParams.toString());

      if (deleteBeforeParam) {
        Object.keys(newParams).forEach((key) => {
          updatedParams.delete(key);
        });
      }

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === undefined) {
          updatedParams.delete(key);
        } else {
          updatedParams.set(key, value);
        }
      });

      const method = replacePage ? router.replace : router.push;
      const basePath = router.asPath.split('?')[0];

      const queryString = updatedParams.toString();
      method(queryString ? `${basePath}?${queryString}` : basePath, undefined, {
        shallow: true,
      });
    },
    [router, searchParams],
  );

  return {
    params,
    searchParams,
    setParams,
  };
};

export default useParamsHandler;
