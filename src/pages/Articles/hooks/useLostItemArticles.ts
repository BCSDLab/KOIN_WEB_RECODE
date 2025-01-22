import { useSuspenseQuery } from '@tanstack/react-query';
import { articles } from 'api';
import { transformLostItemArticles } from 'pages/Articles/utils/transform';

const useLostItemArticles = () => {
  const { data: lostItemArticles } = useSuspenseQuery(
    {
      queryKey: ['lostItem'],
      queryFn: async () => {
        const response = await articles.getLostItemArticles();
        return transformLostItemArticles(response);
      },
    },
  );

  return { lostItemArticles };
};

export default useLostItemArticles;
