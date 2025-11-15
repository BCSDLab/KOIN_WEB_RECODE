import { isKoinError } from '@bcsdlab/koin';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRecruitmentClub } from 'api/club';
import { ClubRecruitmentResponse } from 'api/club/entity';

const EMPTY_RECRUITMENT: ClubRecruitmentResponse = {
  id: 0,
  status: 'NONE',
  dday: 0,
  start_date: '',
  end_date: '',
  image_url: '',
  content: '',
  is_manager: false,
};

export default function useClubRecruitment(clubId: number) {
  const { data: clubRecruitmentData } = useSuspenseQuery({
    queryKey: ['clubRecruitment', clubId],
    queryFn: async () => {
      try {
        return await getRecruitmentClub(clubId);
      } catch (e) {
        if (isKoinError(e) && e.status === 404) {
          return EMPTY_RECRUITMENT;
        }
        throw e;
      }
    },
  });

  return {
    clubRecruitmentData,
  };
}
