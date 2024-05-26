import useMediaQuery from 'utils/hooks/useMediaQuery';
import { MobilePage } from 'pages/Timetable/TimetablePage/MobilePage';
import DefaultPage from './DefaultPage';
import styles from './ModifyTimetablePage.module.scss';

export default function ModifyTimetablePage() {
  const isMobile = useMediaQuery();
  return (
    <div className={styles.page}>
      {!isMobile ? (
        <DefaultPage />
      ) : (
        <MobilePage />
      )}
    </div>
  );
}
