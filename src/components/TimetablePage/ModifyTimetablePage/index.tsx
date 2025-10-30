import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { MobilePage } from 'components/TimetablePage/MainTimetablePage/MobilePage';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import DefaultPage from './DefaultPage';
import styles from './ModifyTimetablePage.module.scss';

export default function ModifyTimetablePage({ id }: { id?: string }) {
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
        <DefaultPage timetableFrameId={timetableFrameId} />
      ) : (
        <MobilePage timetableFrameId={timetableFrameId} />
      )}
    </div>
  );
}
