/* eslint-disable no-restricted-imports */
import React from 'react';
import Curriculum from '../components/Curriculum';
import LectureList from '../components/LectureList';
import MyLectureList from '../components/MyLectureList';
import MyLectureTimetable from '../components/MyLectureTimetable';
import styles from './DefaultPage.module.scss';

export default function DefaultPage() {
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
