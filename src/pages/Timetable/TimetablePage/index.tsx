import React from 'react';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import { MobilePage } from 'pages/Timetable/TimetablePage/MobilePage';
import useScrollToTop from 'utils/hooks/useScrollToTop';
import { useSemester } from 'utils/zustand/semester';
import useTokenState from 'utils/hooks/useTokenState';
import useTimetableFrameList from 'pages/Timetable/hooks/useTimetableFrameList';
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
