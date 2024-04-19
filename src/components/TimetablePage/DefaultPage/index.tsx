/* eslint-disable no-restricted-imports */
import React from 'react';
// import { ReactComponent as LoadingSpinner } from 'assets/svg/loading-spinner.svg';
import styles from './DefaultPage.module.scss';
import Curriculum from './Curriculum';
import MyLectureTimetable from './MyLectureTimetable';
import MyLectureList from './MyLectureList';
import LectureList from './LectureList';

function DefaultPage() {
  return (
    <>
      <h1 className={styles.page__title}>시간표</h1>
      <div className={styles.page__content}>
        {/* 강의 목록 */}
        <LectureList />
        {/* 나의 시간표 타임 테이블 */}
        <MyLectureTimetable />
        {/* 나의 시간표 강의 목록 */}
        <MyLectureList />
        {/* 시간표 커리큘럼 */}
        <Curriculum />
      </div>
    </>
  );
}

export { DefaultPage };
