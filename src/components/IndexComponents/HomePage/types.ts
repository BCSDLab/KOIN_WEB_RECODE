import type { BannersResponse } from 'api/banner/entity';
import type { HotClubResponse } from 'api/club/entity';
import type { StoreCategoriesResponse } from 'api/store/entity';

export interface HomePageProps {
  bannersList: BannersResponse;
  bannerCategoryId: number;
  categories: StoreCategoriesResponse;
  hotClubInfo: HotClubResponse;
}
