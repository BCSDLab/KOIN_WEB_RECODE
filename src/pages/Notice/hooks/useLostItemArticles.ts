import { useSuspenseQuery } from '@tanstack/react-query';
import { notice } from 'api';
import { transformLostItemArticles } from 'pages/Notice/utils/transform';

const useLostItemArticles = () => {
  const { data: lostItemArticles } = useSuspenseQuery(
    {
      queryKey: ['lostItem'],
      queryFn: async () => {
        const response = await notice.getLostItemArticles();
        return transformLostItemArticles(response);
      },
    },
  );

  return { lostItemArticles };
};

export default useLostItemArticles;
