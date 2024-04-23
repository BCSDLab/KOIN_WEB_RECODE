import { useSuspenseQuery } from '@tanstack/react-query';
import { cafeteria } from 'api';
import { type KoinError } from 'interfaces/APIError';
import { CafeteriaMenu } from 'interfaces/Cafeteria';

const CAFETERIA_LIST_KEY = 'CAFETERIA_LIST_KEY';

function useCafeteriaList(date: string) {
  const { data: cafeteriaList } = useSuspenseQuery<
  Awaited<ReturnType<typeof cafeteria.default>>,
  KoinError,
  Array<CafeteriaMenu>,
  [string, string]
  >(
    {
      queryKey: [CAFETERIA_LIST_KEY, date],
      queryFn: async ({ queryKey }) => {
        const [, queryDate] = queryKey;

        return cafeteria.default(queryDate);
      },
      select: (data) => {
        if ('status' in data || !Array.isArray(data)) {
          return [];
        }
        return data as Array<CafeteriaMenu>;
      },
    },
  );
  return { cafeteriaList };
}

export default useCafeteriaList;
