import type { BannersResponse } from 'api/banner/entity';
import type { DiningType } from 'api/dinings/entity';
import type { Semester } from 'api/timetable/entity';

export interface ServerDining {
  type: DiningType;
  dayLabel: string;
  date: string;
}

export interface HomePageProps {
  bannersList: BannersResponse;
  serverDining: ServerDining;
  serverSemester: Semester;
}
