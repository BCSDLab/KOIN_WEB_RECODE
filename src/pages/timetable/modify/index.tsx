import type { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';

import { isKoinError } from '@bcsdlab/koin';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import type { Semester } from 'api/timetable/entity';
import { timetableQueries } from 'api/timetable/queries';
import { SSRLayout } from 'components/layout';
import ModifyTimetablePage from 'components/TimetablePage/ModifyTimetablePage';
import { getRecentSemester, getSemesterFromQuery, resolveTimetableSemester } from 'utils/timetable/semester';
import { isServerAuthError } from 'utils/ts/ssrAuth';
import { withCacheControl } from 'utils/ts/withCacheControl';

export const getServerSideProps = withCacheControl(async (context: GetServerSidePropsContext, _cacheControl, serverRequest) => {
  const queryClient = new QueryClient();

  const { query } = context;
  const { isLoggedIn, userType } = serverRequest;
  const timetableFrameId = Number(query.id);
  let currentSemester = getSemesterFromQuery(query.year, query.term) ?? getRecentSemester();

  if (isLoggedIn && userType === 'STUDENT') {
    try {
      const mySemesterData = await queryClient.fetchQuery(timetableQueries.mySemester(isLoggedIn, { userType }));
      const userSemester = mySemesterData?.semesters?.[0];
      const semester = resolveTimetableSemester(query.year, query.term, userSemester);
      currentSemester = semester ?? currentSemester;

      const prefetchPromises = [
        queryClient.prefetchQuery(timetableQueries.lectureInfo(isLoggedIn, timetableFrameId)),
      ];

      if (semester) {
        prefetchPromises.push(queryClient.prefetchQuery(timetableQueries.lectureList(semester)));
      }

      await Promise.all(prefetchPromises);
    } catch (error) {
      if (!isServerAuthError(error) && !(isKoinError(error) && error.status === 403)) {
        throw error;
      }
    }
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      semester: currentSemester,
    },
  };
});

export default function ModifyTimetablePageWrapper({ semester }: { semester: Semester }) {
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== 'string') {
    return null;
  }

  return <ModifyTimetablePage id={id} semester={semester} />;
}

ModifyTimetablePageWrapper.getLayout = (page: React.ReactNode) => <SSRLayout>{page}</SSRLayout>;
