import { useSuspenseQuery } from '@tanstack/react-query';
import { cafeteriaQueries } from 'api/cafeteria/queries';
import type { DiningPlace, DiningType, OriginalDining } from 'api/dinings/entity';
import { convertDateToSimpleString } from 'components/cafeteria/utils/time';

function useSoldoutPlaces(date: Date, diningType: DiningType): DiningPlace[] {
  const convertedDate = convertDateToSimpleString(date);

  const { data: soldoutPlaces } = useSuspenseQuery({
    ...cafeteriaQueries.dinings(convertedDate),
    select: (data) => {
      if ('status' in data || !Array.isArray(data)) {
        return [];
      }

      return (data as OriginalDining[])
        .filter((dining) => dining.type === diningType && dining.soldout_at)
        .map((dining) => dining.place);
    },
  });

  return soldoutPlaces;
}

export default useSoldoutPlaces;
