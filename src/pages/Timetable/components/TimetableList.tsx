/* eslint-disable no-restricted-imports */
import React from 'react';
import styles from '../TimetablePage/DefaultPage/DefaultPage.module.scss';
import SemesterListbox from './SemesterList';

export default function TimetableList() {
  return (
    <div className={styles['timetable-list']}>
      <SemesterListbox />
      <div className={styles['timetable-list__list']}>
        timetable list
      </div>
    </div>
  );
}
