import { StoreCategoriesResponse, StoreDetailResponse } from 'api/store/entity';
import { useEffect, useState } from 'react';
import useParamsHandler from 'utils/hooks/routing/useParamsHandler';
import useLogger from './useLogger';

export const useScorllLogging = (
  title: string,
  data: StoreCategoriesResponse | StoreDetailResponse | undefined,
) => {
  const [currentHeignt, setCurrentHeight] = useState<number>(window.scrollY);
  const { params, searchParams } = useParamsHandler();
  const logger = useLogger();
  const onScroll = () => setCurrentHeight(window.scrollY);

  useEffect(() => {
    if (document.body.scrollHeight * 0.7 > currentHeignt) {
      window.addEventListener('scroll', onScroll);
    }
    if (document.body.scrollHeight * 0.7 < currentHeignt && data) {
      if ('delivery_price' in data) {
        logger.actionEventClick({ actionTitle: 'BUSINESS', title, value: `search in ${data.name}` });
      }
      if ('total_count' in data) {
        const currentCategoryId = searchParams.get('category') === undefined ? 0 : Number(searchParams.get('category')) - 1;
        logger.actionEventClick({ actionTitle: 'BUSINESS', title, value: `search in ${data.shop_categories[currentCategoryId]?.name}` });
      }
    }
    return () => window.removeEventListener('scroll', onScroll); // 웹 사이트 높이의 70퍼센트를 넘을 때 로깅
  }, [currentHeignt, logger, data, params.category, title, searchParams]);
};
