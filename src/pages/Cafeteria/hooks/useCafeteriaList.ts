import { useSuspenseQuery } from '@tanstack/react-query';
import { cafeteria } from 'api';
import { CafeteriaMenu } from 'interfaces/Cafeteria';
import { convertDateToSimpleString } from 'utils/ts/cafeteria';

const CAFETERIA_LIST_KEY = 'CAFETERIA_LIST_KEY';

function useCafeteriaList(date: Date) {
  const convertedDate = convertDateToSimpleString(date);
  const { data: cafeteriaList } = useSuspenseQuery(
    {
      queryKey: [CAFETERIA_LIST_KEY, convertedDate],
      queryFn: async () => cafeteria.default(convertedDate),
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
