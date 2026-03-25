import React from 'react';
import type { GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { isKoinError } from '@bcsdlab/koin';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { deptQueries } from 'api/dept/queries';
import { createDefaultTimetableFrameList, timetableQueries, timetableQueryKeys } from 'api/timetable/queries';
import { SSRLayout } from 'components/layout';
import useTimetableFrameList from 'components/TimetablePage/hooks/useTimetableFrameList';
import DefaultPage from 'components/TimetablePage/MainTimetablePage/DefaultPage';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useTokenState from 'utils/hooks/state/useTokenState';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import { getRecentSemester } from 'utils/timetable/semester';
import { parseServerSideParams } from 'utils/ts/parseServerSideParams';
import { clearServerAuthCookies, isServerAuthError } from 'utils/ts/ssrAuth';
import { useSemester } from 'utils/zustand/semester';
import type { Term } from 'api/timetable/entity';
import styles from './TimetablePage.module.scss';

const MobilePage = dynamic(
  () => import('components/TimetablePage/MainTimetablePage/MobilePage').then((mod) => mod.MobilePage),
  { ssr: true },
);

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = new QueryClient();
  const { token, query } = parseServerSideParams(context);
  const year = Number(query.year);
  const term = query.term as Term;
  const frameId = Number(query.timetableFrameId);
  const validatedFrameId = Number.isNaN(frameId) ? null : frameId;

  if (token) {
    try {
      const mySemesterData = await queryClient.fetchQuery(timetableQueries.mySemester(token));
      const userSemester = mySemesterData?.semesters?.[0];
      const semester = year && term ? { year, term } : userSemester || getRecentSemester();

      const timetableFrameList = await queryClient.fetchQuery(timetableQueries.frameList(token, semester));

      const mainFrame = timetableFrameList.find((frame) => frame.is_main);
      const currentFrameId = validatedFrameId ?? mainFrame?.id ?? null;

      const prefetchPromises = [
        queryClient.prefetchQuery(timetableQueries.semesterInfo()),
        queryClient.prefetchQuery(deptQueries.list()),
      ];

      if (currentFrameId !== null) {
        prefetchPromises.push(queryClient.prefetchQuery(timetableQueries.lectureInfo(token, currentFrameId)));
      }

      await Promise.all(prefetchPromises);
    } catch (error) {
      if (!isServerAuthError(error) && !(isKoinError(error) && error.status === 403)) throw error;
      if (isServerAuthError(error)) clearServerAuthCookies(context);
      const semester = getRecentSemester();
      queryClient.setQueryData(timetableQueryKeys.frameList(semester), createDefaultTimetableFrameList());
    }
  } else {
    const semester = getRecentSemester();
    queryClient.setQueryData(timetableQueryKeys.frameList(semester), createDefaultTimetableFrameList());
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

function TimetablePage() {
  const isMobile = useMediaQuery();
  useScrollToTop();
  const token = useTokenState();
  const semester = useSemester();
  const router = useRouter();
  const { timetableFrameId } = router.query;
  const { data: timetableFrameList } = useTimetableFrameList(token, semester);
  const mainFrame = timetableFrameList.find((frame) => frame.is_main === true);
  const [currentFrameIndex, setCurrentFrameIndex] = React.useState(mainFrame?.id ? mainFrame.id : 0);

  React.useEffect(() => {
    if (timetableFrameId) {
      setCurrentFrameIndex(Number(timetableFrameId));
    } else {
      setCurrentFrameIndex(mainFrame?.id ? mainFrame.id : 0);
    }
    sessionStorage.setItem('enterTimetablePage', new Date().getTime().toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.page}>
      {!isMobile ? (
        <DefaultPage timetableFrameId={currentFrameIndex} setCurrentFrameId={setCurrentFrameIndex} />
      ) : (
        <MobilePage timetableFrameId={currentFrameIndex} setCurrentFrameId={setCurrentFrameIndex} />
      )}
    </div>
  );
}

export default TimetablePage;

TimetablePage.getLayout = (page: React.ReactNode) => <SSRLayout>{page}</SSRLayout>;
