import type { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { isKoinError } from '@bcsdlab/koin';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { timetableQueries } from 'api/timetable/queries';
import { SSRLayout } from 'components/layout';
import ModifyTimetablePage from 'components/TimetablePage/ModifyTimetablePage';
import { COOKIE_KEY } from 'static/url';
import { resolveTimetableSemester } from 'utils/timetable/semester';
import { parseServerSideParams } from 'utils/ts/parseServerSideParams';
import { clearServerAuthCookies, isServerAuthError } from 'utils/ts/ssrAuth';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = new QueryClient();

  const { token, query } = parseServerSideParams(context);
  const userType = context.req.cookies[COOKIE_KEY.AUTH_USER_TYPE];
  const timetableFrameId = Number(query.id);

  if (token && userType === 'STUDENT') {
    try {
      const mySemesterData = await queryClient.fetchQuery(timetableQueries.mySemester(token, { userType }));
      const userSemester = mySemesterData?.semesters?.[0];
      const semester = resolveTimetableSemester(query.year, query.term, userSemester);

      const prefetchPromises = [queryClient.prefetchQuery(timetableQueries.lectureInfo(token, timetableFrameId))];

      if (semester) {
        prefetchPromises.push(queryClient.prefetchQuery(timetableQueries.lectureList(semester)));
      }

      await Promise.all(prefetchPromises);
    } catch (error) {
      if (!isServerAuthError(error) && !(isKoinError(error) && error.status === 403)) {
        throw error;
      }
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
