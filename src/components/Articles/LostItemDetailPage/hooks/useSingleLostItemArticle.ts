import { useSuspenseQuery } from '@tanstack/react-query';
import { articles } from 'api';
import useTokenState from 'utils/hooks/state/useTokenState';

const useSingleLostItemArticle = (articleId: number) => {
  const token = useTokenState();

  const { data: article } = useSuspenseQuery({
    queryKey: ['lostItem', 'detail', articleId],
    queryFn: async () => {
      const response = await articles.getSingleLostItemArticle(token, articleId);
      return response;
    },
  });

  return { article };
};

export default useSingleLostItemArticle;
