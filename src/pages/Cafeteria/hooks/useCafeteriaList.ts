import { useSuspenseQuery } from '@tanstack/react-query';
import { cafeteria } from 'api';
import { CafeteriaMenu } from 'interfaces/Cafeteria';

const CAFETERIA_LIST_KEY = 'CAFETERIA_LIST_KEY';

function useCafeteriaList(date: string) {
  const { data: cafeteriaList } = useSuspenseQuery(
    {
      queryKey: [CAFETERIA_LIST_KEY, date],
      queryFn: async () => cafeteria.default(date),
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
