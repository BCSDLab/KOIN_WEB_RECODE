import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { Dining, OriginalDining } from 'interfaces/Cafeteria';
import useTokenState from 'utils/hooks/state/useTokenState';
import { convertDateToSimpleString } from 'utils/ts/cafeteria';
import { cafeteria } from 'api';

const DININGS_KEY = 'DININGS_KEY';

function useDinings(date: Date) {
  const convertedDate = convertDateToSimpleString(date);
  const queryClient = useQueryClient();
  const token = useTokenState();

  const { data: dinings } = useSuspenseQuery({
    queryKey: [DININGS_KEY, convertedDate],
    queryFn: async () => cafeteria.default(convertedDate, token),
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

  const like = useMutation({
    mutationFn: async (diningId: number) => cafeteria.like(diningId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DININGS_KEY, convertedDate] });
    },
  });

  const cancelLike = useMutation({
    mutationFn: async (diningId: number) => cafeteria.cancelLike(diningId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DININGS_KEY, convertedDate] });
    },
  });

  const likeDining = (diningId: number, isLike: boolean) => {
    if (isLike) {
      return cancelLike.mutate(diningId);
    }

    return like.mutate(diningId);
  };

  return { dinings, likeDining };
}

export default useDinings;
