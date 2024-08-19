import { StoreCategoriesResponse, StoreDetailResponse, StoreEventListResponse } from 'api/store/entity';
import { useEffect, useState } from 'react';
import useParamsHandler from 'utils/hooks/routing/useParamsHandler';
import useLogger from './useLogger';

export const useScorllLogging = (
  title: string,
  data: StoreCategoriesResponse | StoreDetailResponse | StoreEventListResponse | undefined,
) => {
  const [currentHeignt, setCurrentHeight] = useState<number>(window.scrollY);
  const { params, searchParams } = useParamsHandler();
  const logger = useLogger();
  const onScroll = () => setCurrentHeight(window.scrollY);

  useEffect(() => {
    if (document.body.scrollHeight * 0.7 > currentHeignt) {
      window.addEventListener('scroll', onScroll);
    }
    console.log(document.body.scrollHeight * 0.7);
    console.log(currentHeignt);
    if (document.body.scrollHeight * 0.7 < currentHeignt && data) {
      console.log('test');
      if ('total_count' in data && title === 'shop_categories') {
        const currentCategoryId = searchParams.get('category') === undefined ? 0 : Number(searchParams.get('category')) - 1;
        logger.actionEventClick({
          actionTitle: 'BUSINESS', title, value: `scoll in ${data.shop_categories[currentCategoryId]?.name}`, event_category: 'scroll',
        });
      }
      if (title === 'shop_detail_view' && 'name' in data) {
        logger.actionEventClick({
          actionTitle: 'BUSINESS', title, value: data.name, event_category: 'scroll',
        });
      }
      if (title === 'shop_detail_view_event' && 'events' in data) {
        logger.actionEventClick({
          actionTitle: 'BUSINESS', title, value: data.events[0].shop_name, event_category: 'scroll',
        });
      }
    }
    return () => window.removeEventListener('scroll', onScroll); // 웹 사이트 높이의 70퍼센트를 넘을 때 로깅
  }, [currentHeignt, logger, data, params.category, title, searchParams]);
};
