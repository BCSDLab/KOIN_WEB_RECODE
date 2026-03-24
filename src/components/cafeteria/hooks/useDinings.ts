import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { cafeteriaMutations } from 'api/cafeteria/mutations';
import { cafeteriaQueries } from 'api/cafeteria/queries';
import { Dining, OriginalDining } from 'api/dinings/entity';
import { convertDateToSimpleString } from 'components/cafeteria/utils/time';
import useTokenState from 'utils/hooks/state/useTokenState';

function useDinings(date: Date) {
  const convertedDate = convertDateToSimpleString(date);
  const queryClient = useQueryClient();
  const token = useTokenState();

  const { data: dinings } = useSuspenseQuery({
    ...cafeteriaQueries.dinings(convertedDate),
    select: (data) => {
      if ('status' in data || !Array.isArray(data)) {
        return [];
      }
      return (data as Array<OriginalDining>).map((dining) => ({
        ...dining,
        menu: dining.menu.map((menuName, index) => ({ id: index, name: menuName })),
      })) as Array<Dining>;
    },
  });
  const likeMutation = cafeteriaMutations.likeDining(queryClient, token, convertedDate);
  const cancelLikeMutation = cafeteriaMutations.cancelLikeDining(queryClient, token, convertedDate);

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
