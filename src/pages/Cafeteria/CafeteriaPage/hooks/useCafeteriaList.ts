import { useQuery } from 'react-query';
import { cafeteria } from 'api';
import { type KoinError } from 'interfaces/APIError';
import { CafeteriaMenu } from 'interfaces/Cafeteria';

const CAFETERIA_LIST_KEY = 'CAFETERIA_LIST_KEY';

function useCafeteriaList(date: string) {
  return useQuery<
  Awaited<ReturnType<typeof cafeteria.default>>,
  KoinError,
  Array<CafeteriaMenu> | undefined,
  [string, string]
  >(
    [
      CAFETERIA_LIST_KEY,
      date,
    ],
    ({ queryKey: [, _date] }) => cafeteria.default(_date),
    {
      select: (data) => (('status' in data) ? undefined : data as Array<CafeteriaMenu>),
    },
  );
}

export default useCafeteriaList;
