import React from 'react';
import { MobilePage } from 'pages/TimetablePage/MainTimetablePage/MobilePage';
import { useSemester } from 'utils/zustand/semester';
import useTimetableFrameList from 'pages/TimetablePage/hooks/useTimetableFrameList';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import useTokenState from 'utils/hooks/state/useTokenState';
import DefaultPage from './DefaultPage';
import styles from './TimetablePage.module.scss';

function TimetablePage() {
  const isMobile = useMediaQuery();
  useScrollToTop();
  const token = useTokenState();
  const semester = useSemester();
  const [currentFrameIndex, setCurrentFrameIndex] = React.useState(0);
  const { data: timetableFrameList } = useTimetableFrameList(token, semester);
  sessionStorage.setItem('enterTimetablePage', new Date().getTime().toString());

  React.useEffect(() => {
    if (timetableFrameList) {
      const mainFrame = timetableFrameList.find(
        (frame) => frame.is_main === true,
      );
      if (mainFrame && mainFrame.id) {
        setCurrentFrameIndex(mainFrame.id);
      }
    }
  }, [timetableFrameList]);

  return (
    <div className={styles.page}>
      {!isMobile ? (
        <DefaultPage frameId={currentFrameIndex} setCurrentFrameId={setCurrentFrameIndex} />
      ) : (
        <MobilePage frameId={String(currentFrameIndex)} />
      )}
    </div>
  );
}

export default TimetablePage;
