import { queryOptions } from '@tanstack/react-query';
import { getMyReview } from 'api/store';
import type { ReviewSorter } from 'api/storeMobile/entity';
import { storeMobileQueryKeys } from 'api/storeMobile/queries';
import { getViewerScope } from 'utils/ts/getViewerScope';

// 내 리뷰(shops/:id/reviews/me)는 로그인일 때만 부른다(order와 같음).
// 키를 리뷰 목록과 같은 접두사(reviews(id, scope)) 아래에 둬서 삭제 후 한 번에 무효화한다
export const storeReviewsQueries = {
  myReviews: (id: string, sorter: ReviewSorter, isLoggedIn: boolean) =>
    queryOptions({
      queryKey: [...storeMobileQueryKeys.reviews(id, getViewerScope(isLoggedIn)), 'me', sorter] as const,
      queryFn: () => getMyReview(id, sorter),
      enabled: isLoggedIn,
    }),
};
