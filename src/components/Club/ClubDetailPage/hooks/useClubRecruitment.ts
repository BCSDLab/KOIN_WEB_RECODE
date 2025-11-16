import { useRouter } from 'next/router';
import { isKoinError } from '@bcsdlab/koin';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRecruitmentClub } from 'api/club';

export default function useClubRecruitment(clubId: number | string | undefined) {
  const router = useRouter();
  const navigate = (path: string) => {
    router.push(path);
  };

  if (!clubId) {
    navigate('/clubs');
  }
  const { data: clubRecruitmentData } = useSuspenseQuery({
    queryKey: ['clubRecruitment', clubId],
    queryFn: async () => {
      try {
        const data = await getRecruitmentClub(clubId!);
        return data;
      } catch (e) {
        if (isKoinError(e) && e.status === 404) {
          return {
            id: 0,
            status: 'NONE',
            dday: 0,
            start_date: '',
            end_date: '',
            image_url: '',
            content: '',
            is_manager: false,
          };
        }
        throw e;
      }
    },
  });

  return {
    clubRecruitmentData,
  };
}
