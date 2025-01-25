import { useSuspenseQuery } from '@tanstack/react-query';
import { articles } from 'api';
import { transformSingleLostItemArticle } from 'pages/Articles/utils/transform';

const useSingleLostItemArticle = (id: number) => {
  const { data: article } = useSuspenseQuery({
    queryKey: ['lostItem', id],
    queryFn: async () => {
      const response = await articles.getSingleLostItemArticle(id);
      return transformSingleLostItemArticle(response);
    },
  });

  return { article };
};

export default useSingleLostItemArticle;
