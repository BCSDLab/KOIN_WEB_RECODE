import React from 'react';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import { MobilePage } from 'pages/TimetablePage/MainTimetablePage/MobilePage';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import { useSemester } from 'utils/zustand/semester';
import useTokenState from 'utils/hooks/state/useTokenState';
import useTimetableFrameList from 'pages/TimetablePage/hooks/useTimetableFrameList';
import styles from './TimetablePage.module.scss';
import DefaultPage from './DefaultPage';

function TimetablePage() {
  const isMobile = useMediaQuery();
  useScrollToTop();
  const token = useTokenState();
  const semester = useSemester();
  const [currentFrameIndex, setCurrentFrameIndex] = React.useState(0);
  const { data: timetableFrameList } = useTimetableFrameList(token, semester);

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
