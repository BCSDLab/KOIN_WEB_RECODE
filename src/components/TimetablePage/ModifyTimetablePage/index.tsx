import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import DefaultPage from './DefaultPage';
import type { Semester } from 'api/timetable/entity';
import styles from './ModifyTimetablePage.module.scss';

const MobilePage = dynamic(
  () => import('components/TimetablePage/MainTimetablePage/MobilePage').then((mod) => mod.MobilePage),
  { ssr: true },
);

export default function ModifyTimetablePage({ id, semester }: { id?: string; semester: Semester }) {
  const isMobile = useMediaQuery();
  const timetableFrameId = id ? Number(id) : null;
  const router = useRouter();
  const navigation = router.push;

  useEffect(() => {
    if (timetableFrameId === null) {
      navigation('/timetable');
    }
  }, [timetableFrameId, navigation]);

  if (timetableFrameId === null) {
    return null;
  }

  return (
    <div className={styles.page}>
      {!isMobile ? (
        <DefaultPage timetableFrameId={timetableFrameId} semester={semester} />
      ) : (
        <MobilePage timetableFrameId={timetableFrameId} />
      )}
    </div>
  );
}
