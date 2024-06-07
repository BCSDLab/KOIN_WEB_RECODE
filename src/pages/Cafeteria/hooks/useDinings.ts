import { useSuspenseQuery } from '@tanstack/react-query';
import { cafeteria } from 'api';
import { Dining, OriginalDining } from 'interfaces/Cafeteria';
import { convertDateToSimpleString } from 'utils/ts/cafeteria';

const DININGS_KEY = 'DININGS_KEY';

function useDinings(date: Date) {
  const convertedDate = convertDateToSimpleString(date);
  const { data: dinings } = useSuspenseQuery(
    {
      queryKey: [DININGS_KEY, convertedDate],
      queryFn: async () => cafeteria.default(convertedDate),
      select: (data) => {
        if ('status' in data || !Array.isArray(data)) {
          return [];
        }
        return (data as Array<OriginalDining>).map((dining) => ({
          ...dining,
          menu: dining.menu.map((menuName, index) => ({ id: index, name: menuName })),
        })) as Array<Dining>;
      },
    },
  );
  return { dinings };
}

export default useDinings;
