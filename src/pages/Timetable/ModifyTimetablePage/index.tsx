import React from 'react';

export default function ModifyTimetablePage() {
  return (
    <div>
      시간표 수정 페이지

      {/* 강의 목록 */}
      {/* <LectureList /> */}

      {/* 시간표 타임테이블 */}
      {/* <div ref={timetableRef} className={styles.page__timetable}>
        <ErrorBoundary fallbackClassName="loading">
          <React.Suspense fallback={<LoadingSpinner size="50" />}>
            <Timetable
              lectures={myLectureDayValue}
              similarSelectedLecture={similarSelectedLectureDayList}
              selectedLectureIndex={selectedLectureIndex}
              columnWidth={140}
              firstColumnWidth={70}
              rowHeight={32.5}
              totalHeight={700}
            />
          </React.Suspense>
        </ErrorBoundary>
      </div> */}
    </div>
  );
}
