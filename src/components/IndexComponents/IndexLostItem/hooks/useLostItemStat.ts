import { useSuspenseQuery } from '@tanstack/react-query';
import { getLostItemStat } from 'api/articles';

const useLostItemStat = () => {
  const { data: lostItemStat } = useSuspenseQuery({
    queryKey: ['lostItemStat'],
    queryFn: async () => {
      const response = await getLostItemStat();
      return response;
    },
  });

  return { lostItemStat };
};

export default useLostItemStat;
