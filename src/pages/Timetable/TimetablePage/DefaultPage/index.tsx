/* eslint-disable no-restricted-imports */
import LoadingSpinner from 'components/common/LoadingSpinner';
import React, { Suspense } from 'react';
import MainTimetable from '../../components/MyLectureTimetable';
import TimetableList from '../../components/TimetableList';
import styles from './DefaultPage.module.scss';

export default function DefaultPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.page__title}>시간표</h1>
      <Suspense
        fallback={(
          <div className={styles['central-loading-spinner']}><LoadingSpinner size="100" /></div>
        )}
      >
        <div className={styles.page__content}>
          <TimetableList />
          <MainTimetable />
        </div>
      </Suspense>
    </div>
  );
}
