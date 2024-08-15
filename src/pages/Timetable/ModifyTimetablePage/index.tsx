import useMediaQuery from 'utils/hooks/useMediaQuery';
import { MobilePage } from 'pages/Timetable/TimetablePage/MobilePage';
import { useParams } from 'react-router-dom';
import DefaultPage from './DefaultPage';
import styles from './ModifyTimetablePage.module.scss';

export default function ModifyTimetablePage() {
  const isMobile = useMediaQuery();
  const { id: frameId } = useParams();
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
