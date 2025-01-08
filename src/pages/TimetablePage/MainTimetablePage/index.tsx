import useTimetableFrameList from 'pages/TimetablePage/hooks/useTimetableFrameList';
import { MobilePage } from 'pages/TimetablePage/MainTimetablePage/MobilePage';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useTokenState from 'utils/hooks/state/useTokenState';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import { useSemester } from 'utils/zustand/semester';
import React from 'react';
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
  const mainFrame = timetableFrameList.find((frame) => frame.is_main === true);
  const [currentFrameIndex, setCurrentFrameIndex] = React.useState(
    mainFrame?.id ? mainFrame.id : 0
  );

  React.useEffect(() => {
    if (location.state?.frameId) {
      setCurrentFrameIndex(Number(location.state?.frameId));
    } else {
      setCurrentFrameIndex(mainFrame?.id ? mainFrame.id : 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  sessionStorage.setItem('enterTimetablePage', new Date().getTime().toString());

  return (
    <div className={styles.page}>
      {!isMobile ? (
        <DefaultPage frameId={currentFrameIndex} setCurrentFrameId={setCurrentFrameIndex} />
      ) : (
        <MobilePage frameId={currentFrameIndex} />
      )}
    </div>
  );
}

export default TimetablePage;
