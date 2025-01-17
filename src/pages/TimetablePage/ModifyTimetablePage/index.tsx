import { MobilePage } from 'pages/TimetablePage/MainTimetablePage/MobilePage';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import DefaultPage from './DefaultPage';
import styles from './ModifyTimetablePage.module.scss';

export default function ModifyTimetablePage() {
  const isMobile = useMediaQuery();
  const { id } = useParams();
  const frameId = id ? Number(id) : null;
  const navigation = useNavigate();

  useEffect(() => {
    if (frameId === null) {
      navigation('/timetable');
    }
  }, [frameId, navigation]);

  if (frameId === null) {
    return null;
  }

  return (
    <div className={styles.page}>
      {!isMobile ? (
        <DefaultPage frameId={frameId} />
      ) : (
        <MobilePage frameId={frameId} />
      )}
    </div>
  );
}
