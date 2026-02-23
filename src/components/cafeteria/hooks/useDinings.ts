import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { cancelCafeteriaDiningLike, getCafeteriaDinings, likeCafeteriaDining } from 'api/cafeteria';
import { Dining, OriginalDining } from 'api/dinings/entity';
import { convertDateToSimpleString } from 'components/cafeteria/utils/time';
import useTokenState from 'utils/hooks/state/useTokenState';

const DININGS_KEY = 'DININGS_KEY';

function useDinings(date: Date) {
  const convertedDate = convertDateToSimpleString(date);
  const queryClient = useQueryClient();
  const token = useTokenState();

  const { data: dinings } = useSuspenseQuery({
    queryKey: [DININGS_KEY, convertedDate],
    queryFn: async () => getCafeteriaDinings(convertedDate),
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

  const likeDiningMutation = useMutation({
    mutationFn: async (diningId: number) => likeCafeteriaDining(diningId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DININGS_KEY, convertedDate] });
    },
  });

  const cancelLikeDiningMutation = useMutation({
    mutationFn: async (diningId: number) => cancelCafeteriaDiningLike(diningId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DININGS_KEY, convertedDate] });
    },
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
