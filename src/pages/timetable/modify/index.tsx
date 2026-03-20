import type { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { isKoinError } from '@bcsdlab/koin';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { timetableQueries } from 'api/timetable/queries';
import { SSRLayout } from 'components/layout';
import ModifyTimetablePage from 'components/TimetablePage/ModifyTimetablePage';
import { COOKIE_KEY } from 'static/url';
import { getRecentSemester } from 'utils/timetable/semester';
import { parseServerSideParams } from 'utils/ts/parseServerSideParams';
import { clearServerAuthCookies, isServerAuthError } from 'utils/ts/ssrAuth';
import type { Term } from 'api/timetable/entity';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = new QueryClient();

  const { token, query } = parseServerSideParams(context);
  const userType = context.req.cookies[COOKIE_KEY.AUTH_USER_TYPE];
  const timetableFrameId = Number(query.id);

  if (token && userType === 'STUDENT') {
    try {
      const mySemesterData = await queryClient.fetchQuery(timetableQueries.mySemester(token, { userType }));
      const year = Number(query.year);
      const term = query.term as Term;
      const userSemester = mySemesterData?.semesters?.[0];
      const semester = year && term ? { year, term } : userSemester || getRecentSemester();

      await Promise.all([
        queryClient.prefetchQuery(timetableQueries.lectureInfo(token, timetableFrameId)),
        queryClient.prefetchQuery(timetableQueries.lectureList(semester)),
      ]);
    } catch (error) {
      if (!isServerAuthError(error) && !(isKoinError(error) && error.status === 403)) throw error;
      if (isServerAuthError(error)) clearServerAuthCookies(context);
    }
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
