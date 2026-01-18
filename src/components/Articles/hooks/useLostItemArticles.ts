import { useSuspenseQuery } from '@tanstack/react-query';
import { articles } from 'api';
import { ItemArticleRequestDTO } from 'api/articles/entity';
import useTokenState from 'utils/hooks/state/useTokenState';

const useLostItemArticles = (data: ItemArticleRequestDTO) => {
  const token = useTokenState();

  const { data: lostItemArticles } = useSuspenseQuery({
    queryKey: ['lostItem', data],
    queryFn: async () => {
      const response = await articles.getLostItemArticles(token, data);
      return response;
    },
  });

  return { lostItemArticles };
};

export default useLostItemArticles;
