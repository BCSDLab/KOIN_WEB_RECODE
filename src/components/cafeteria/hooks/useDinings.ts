import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { cafeteriaMutations } from 'api/cafeteria/mutations';
import { cafeteriaQueries } from 'api/cafeteria/queries';
import type { Dining, OriginalDining } from 'api/dinings/entity';
import { convertDateToSimpleString } from 'components/cafeteria/utils/time';

function useDinings(date: Date) {
  const convertedDate = convertDateToSimpleString(date);
  const queryClient = useQueryClient();

  const { data: dinings } = useSuspenseQuery({
    ...cafeteriaQueries.dinings(convertedDate),
    select: (data) => {
      if ('status' in data || !Array.isArray(data)) {
        return [];
      }

      return (data as OriginalDining[]).map((dining) => ({
        ...dining,
        menu: dining.menu.map((menuName, index) => ({ id: index, name: menuName })),
      })) as Dining[];
    },
  });
  const likeMutation = cafeteriaMutations.likeDining(queryClient, convertedDate);
  const cancelLikeMutation = cafeteriaMutations.cancelLikeDining(queryClient, convertedDate);

  const likeDiningMutation = useMutation({
    ...likeMutation,
  });

  const cancelLikeDiningMutation = useMutation({
    ...cancelLikeMutation,
  });

  const likeDining = (diningId: number, isLike: boolean) => {
    if (isLike) {
      return cancelLikeDiningMutation.mutate(diningId);
    }

    return likeDiningMutation.mutate(diningId);
  };

  return { dinings, likeDining };
}

export default useDinings;
