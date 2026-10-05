import { mutationOptions, type QueryClient } from '@tanstack/react-query';

import { cancelCafeteriaDiningLike, likeCafeteriaDining } from './index';
import { cafeteriaQueryKeys } from './queries';

const invalidateDinings = (queryClient: QueryClient, date: string) =>
  queryClient.invalidateQueries({ queryKey: cafeteriaQueryKeys.dinings(date) });

export const cafeteriaMutations = {
  likeDining: (queryClient: QueryClient, date: string) =>
    mutationOptions({
      mutationFn: (diningId: number) => likeCafeteriaDining(diningId),
      onSuccess: () => invalidateDinings(queryClient, date),
    }),

  cancelLikeDining: (queryClient: QueryClient, date: string) =>
    mutationOptions({
      mutationFn: (diningId: number) => cancelCafeteriaDiningLike(diningId),
      onSuccess: () => invalidateDinings(queryClient, date),
    }),
};
