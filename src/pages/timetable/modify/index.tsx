import type { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { timetable } from 'api';
import { SSRLayout } from 'components/layout';
import { MY_SEMESTER_INFO_KEY } from 'components/TimetablePage/hooks/useMySemester';
import { SEMESTER_INFO_KEY } from 'components/TimetablePage/hooks/useSemesterOptionList';
import { TIMETABLE_INFO_LIST } from 'components/TimetablePage/hooks/useTimetableInfoList';
import ModifyTimetablePage from 'components/TimetablePage/ModifyTimetablePage';
import { getRecentSemester } from 'utils/timetable/semester';
import { parseServerSideParams } from 'utils/ts/parseServerSideParams';
import type * as entity from 'api/timetable/entity';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = new QueryClient();

  const { token, query } = parseServerSideParams(context);
  const userType = context.req.cookies['AUTH_USER_TYPE'];
  const timetableFrameId = Number(context.params?.id);

  if (token && userType === 'STUDENT') {
    const mySemesterData = await queryClient.fetchQuery({
      queryKey: [MY_SEMESTER_INFO_KEY],
      queryFn: () => timetable.getMySemester(token),
    });
    const year = Number(query.year);
    const term = query.term as entity.Term;
    const userSemester = mySemesterData?.semesters?.[0];
    const semester = year && term ? { year, term } : userSemester || getRecentSemester();

    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: [TIMETABLE_INFO_LIST, timetableFrameId],
        queryFn: () => timetable.getTimetableLectureInfo(token, timetableFrameId),
      }),
      queryClient.prefetchQuery({
        queryKey: [SEMESTER_INFO_KEY, semester],
        queryFn: () => (semester ? timetable.getLectureList(semester) : null),
      }),
    ]);
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default function ModifyTimetablePageWrapper() {
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== 'string') {
    return null;
  }

  return <ModifyTimetablePage id={id} />;
}

ModifyTimetablePageWrapper.getLayout = (page: React.ReactNode) => <SSRLayout>{page}</SSRLayout>;
