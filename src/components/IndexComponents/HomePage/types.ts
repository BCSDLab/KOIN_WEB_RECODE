import type { BannersResponse } from 'api/banner/entity';
import type { HotClubResponse } from 'api/club/entity';
import type { DiningType } from 'api/dinings/entity';
import type { StoreCategoriesResponse } from 'api/store/entity';
import type { Semester } from 'api/timetable/entity';

/**
 * 서버가 렌더 시점에 확정한 식단 정보.
 *
 * 클라이언트가 다시 계산하면 렌더가 갈린다. 클라이언트는 사용자 기기 시계·타임존을 쓰므로
 * KST 밖 사용자는 자정과 무관하게 상시 어긋난다. 대가는 최대 60초 낡은 값(공유 캐시)이지만,
 * 경계가 하루 3번뿐이라 영향 구간이 작다.
 */
export interface ServerDining {
  type: DiningType;
  dayLabel: string;
  /** 조회 대상 날짜 (ISO 문자열) */
  date: string;
}

export interface HomePageProps {
  bannersList: BannersResponse;
  bannerCategoryId: number;
  categories: StoreCategoriesResponse;
  hotClubInfo: HotClubResponse;
  serverDining: ServerDining;
  /** 서버 렌더 시각 (ISO). 시각 파생 렌더의 공통 기준값. */
  serverNow: string;
  /** 서버가 확정한 학기. 클라이언트에서 다시 정하지 않는다. */
  serverSemester: Semester;
}
