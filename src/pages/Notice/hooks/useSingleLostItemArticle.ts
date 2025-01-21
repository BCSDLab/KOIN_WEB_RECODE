import { useSuspenseQuery } from '@tanstack/react-query';
import { notice } from 'api';
import { transformSingleLostItemArticle } from 'pages/Notice/utils/transform';

const useSingleLostItemArticle = (id: number) => {
  const { data: article } = useSuspenseQuery({
    queryKey: ['lostItem', id],
    queryFn: async () => {
      const response = await notice.getSingleLostItemArticle(id);
      return transformSingleLostItemArticle(response);
    },
  });

  return { article };
};

export default useSingleLostItemArticle;
