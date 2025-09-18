import { useSuspenseQuery } from '@tanstack/react-query';
import { articles } from 'api';
import { transformSingleLostItemArticle } from 'components/Articles/utils/transform';

const useSingleLostItemArticle = (token: string, id: number) => {
  const { data: article } = useSuspenseQuery({
    queryKey: ['lostItem', id],
    queryFn: async () => {
      const response = await articles.getSingleLostItemArticle(token, id);
      return transformSingleLostItemArticle(response);
    },
  });

  return { article };
};

export default useSingleLostItemArticle;
