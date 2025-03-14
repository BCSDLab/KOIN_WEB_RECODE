import React from 'react';
import { MobilePage } from 'pages/TimetablePage/MainTimetablePage/MobilePage';
import { useSemester } from 'utils/zustand/semester';
import useTimetableFrameList from 'pages/TimetablePage/hooks/useTimetableFrameList';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useLocation } from 'react-router-dom';
import DefaultPage from './DefaultPage';
import styles from './TimetablePage.module.scss';

function TimetablePage() {
  const isMobile = useMediaQuery();
  useScrollToTop();
  const token = useTokenState();
  const semester = useSemester();
  const location = useLocation();
  const { data: timetableFrameList } = useTimetableFrameList(token, semester);
  const mainFrame = timetableFrameList.find(
    (frame) => frame.is_main === true,
  );
  const [currentFrameIndex, setCurrentFrameIndex] = React.useState(
    mainFrame?.id ? mainFrame.id : 0,
  );

  React.useEffect(() => {
    if (location.state?.timetableFrameId) {
      setCurrentFrameIndex(Number(location.state?.timetableFrameId));
    } else {
      setCurrentFrameIndex(mainFrame?.id ? mainFrame.id : 0);
    }
    sessionStorage.setItem('enterTimetablePage', new Date().getTime().toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.page}>
      {!isMobile ? (
        <DefaultPage
          timetableFrameId={currentFrameIndex}
          setCurrentFrameId={setCurrentFrameIndex}
        />
      ) : (
        <MobilePage timetableFrameId={currentFrameIndex} />
      )}
    </div>
  );
}

export default TimetablePage;
