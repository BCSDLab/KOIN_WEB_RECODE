import { MobilePage } from 'pages/TimetablePage/MainTimetablePage/MobilePage';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import DefaultPage from './DefaultPage';
import styles from './ModifyTimetablePage.module.scss';

export default function ModifyTimetablePage() {
  const isMobile = useMediaQuery();
  const { id } = useParams();
  const timetableFrameId = id ? Number(id) : null;
  const navigation = useNavigate();

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
