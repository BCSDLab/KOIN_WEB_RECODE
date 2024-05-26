/* eslint-disable no-restricted-imports */
import LoadingSpinner from 'components/common/LoadingSpinner';
import React, { Suspense } from 'react';
import { ReactComponent as TimetableIcon } from 'assets/svg/timetable-icon.svg';
import MainTimetable from '../../components/MyLectureTimetable';
import TimetableList from '../../components/TimetableList';
import styles from './DefaultPage.module.scss';

export default function DefaultPage() {
  return (
    <div className={styles.page}>
      <div className={styles.page__title}>
        <TimetableIcon />
        <h1 className={styles['page__title--name']}>시간표</h1>
      </div>
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
