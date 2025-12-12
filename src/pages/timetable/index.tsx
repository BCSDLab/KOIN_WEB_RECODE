import React from 'react';
import type { GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { timetable, dept } from 'api';
import { SSRLayout } from 'components/layout';
import { MY_SEMESTER_INFO_KEY } from 'components/TimetablePage/hooks/useMySemester';
import { SEMESTER_INFO_KEY } from 'components/TimetablePage/hooks/useSemesterOptionList';
import useTimetableFrameList, { TIMETABLE_FRAME_KEY } from 'components/TimetablePage/hooks/useTimetableFrameList';
import { TIMETABLE_INFO_LIST } from 'components/TimetablePage/hooks/useTimetableInfoList';
import DefaultPage from 'components/TimetablePage/MainTimetablePage/DefaultPage';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useTokenState from 'utils/hooks/state/useTokenState';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import { getRecentSemester } from 'utils/timetable/semester';
import { parseServerSideParams } from 'utils/ts/parseServerSideParams';
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

  if (token) {
    const mySemesterData = await queryClient.fetchQuery({
      queryKey: [MY_SEMESTER_INFO_KEY],
      queryFn: () => timetable.getMySemester(token),
    });
    const userSemester = mySemesterData?.semesters?.[0];
    const semester = year && term ? { year, term } : userSemester || getRecentSemester();

    const timetableFrameList = await queryClient.fetchQuery({
      queryKey: [TIMETABLE_FRAME_KEY + semester.year + semester.term],
      queryFn: () => timetable.getTimetableFrame(token, semester),
    });

    const mainFrame = timetableFrameList.find((frame) => frame.is_main);
    const currentFrameId = frameId ?? mainFrame?.id ?? null;

    const prefetchPromises = [
      queryClient.prefetchQuery({
        queryKey: [SEMESTER_INFO_KEY],
        queryFn: timetable.getSemesterInfoList,
      }),
      queryClient.prefetchQuery({
        queryKey: ['dept'],
        queryFn: () => dept.getDeptList(),
      }),
    ];

    if (currentFrameId !== null) {
      prefetchPromises.push(
        queryClient.prefetchQuery({
          queryKey: [TIMETABLE_INFO_LIST, currentFrameId],
          queryFn: () => timetable.getTimetableLectureInfo(token, currentFrameId),
        }),
      );
    }

    await Promise.all(prefetchPromises);
  } else {
    const semester = getRecentSemester();
    queryClient.setQueryData(
      [TIMETABLE_FRAME_KEY + semester.year + semester.term],
      [{ id: null, name: '기본 시간표', is_main: true }],
    );
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
