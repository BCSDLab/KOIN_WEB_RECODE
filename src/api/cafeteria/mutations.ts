import { mutationOptions, type QueryClient } from '@tanstack/react-query';

import { cancelCafeteriaDiningLike, likeCafeteriaDining } from './index';
import { cafeteriaQueryKeys } from './queries';

const invalidateDinings = (queryClient: QueryClient, date: string) =>
  queryClient.invalidateQueries({ queryKey: cafeteriaQueryKeys.dinings(date) });

export const cafeteriaMutations = {
  likeDining: (queryClient: QueryClient, token: string, date: string) =>
    mutationOptions({
      mutationFn: (diningId: number) => likeCafeteriaDining(diningId, token),
      onSuccess: () => invalidateDinings(queryClient, date),
    }),

  cancelLikeDining: (queryClient: QueryClient, token: string, date: string) =>
    mutationOptions({
      mutationFn: (diningId: number) => cancelCafeteriaDiningLike(diningId, token),
      onSuccess: () => invalidateDinings(queryClient, date),
    }),
};
