import { useQuery } from '@tanstack/react-query';
import { cafeteria } from 'api';
import { type KoinError } from 'interfaces/APIError';
import { CafeteriaMenu } from 'interfaces/Cafeteria';

const CAFETERIA_LIST_KEY = 'CAFETERIA_LIST_KEY';

function useCafeteriaList(date: string) {
  const { data: cafeteriaList } = useQuery<
  Awaited<ReturnType<typeof cafeteria.default>>,
  KoinError,
  Array<CafeteriaMenu> | undefined,
  [string, string]
  >(
    {
      queryKey: [CAFETERIA_LIST_KEY, date],
      queryFn: async ({ queryKey }) => {
        const [, queryDate] = queryKey;

        return cafeteria.default(queryDate);
      },
      select: (data) => (('status' in data) ? undefined : data as Array<CafeteriaMenu>),
    },
  );
  return { cafeteriaList };
}

export default useCafeteriaList;
