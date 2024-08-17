/* eslint-disable no-restricted-imports */
import LoadingSpinner from 'components/common/LoadingSpinner';
import TimetableHeader from 'pages/Timetable/components/TimetableHeader';
import { Suspense } from 'react';
import TimetableList from 'pages/Timetable/components/TimetableList';
import MainTimetable from 'pages/Timetable/components/MyLectureTimetable';
import styles from './DefaultPage.module.scss';

export default function DefaultPage({ frameId }: { frameId: string }) {
  return (
    <div className={styles.page}>
      <TimetableHeader />
      <Suspense
        fallback={(
          <div className={styles['central-loading-spinner']}>
            <LoadingSpinner size="100" />
          </div>
        )}
      >
        <div className={styles.page__content}>
          <TimetableList />
          <MainTimetable frameId={Number(frameId)} />
        </div>
      </Suspense>
    </div>
  );
}
