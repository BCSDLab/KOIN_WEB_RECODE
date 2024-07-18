/* eslint-disable no-restricted-imports */
import LoadingSpinner from 'components/common/LoadingSpinner';
import React, { Suspense } from 'react';
import useBooleanState from 'utils/hooks/useBooleanState';
import picture1 from 'assets/svg/fixes-image.jpg';
import Curriculum from '../components/Curriculum';
import LectureList from '../components/LectureList';
import MyLectureList from '../components/MyLectureList';
import MyLectureTimetable from '../components/MyLectureTimetable';
import styles from './DefaultPage.module.scss';

export default function DefaultPage() {
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);
  return (
    <>
      <div className={styles.page__head}>
        <h1 className={styles.page__title}>시간표</h1>
        <div className={styles.page__instructions}>
          학교 측에 의해 강의 시간이 변경된 과목이 있으니 변경 전에 해당 과목을 시간표에 추가하신 학우분은
          나의 시간표에서 삭제 후 다시 추가해주시기 바랍니다.&nbsp;
          <button type="button" onClick={openModal} className={styles['page__instructions--button']}>변경된 강의 확인하기</button>
        </div>
      </div>
      <Suspense fallback={<div className={styles['central-loading-spinner']}><LoadingSpinner size="100" /></div>}>
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
      </Suspense>
      {
        isModalOpen
        && (
          <div className={styles.background} aria-hidden>
            <div className={styles.container}>
              <img src={picture1} alt="s" />
              <button type="button" onClick={closeModal} className={styles.container__close}>닫기</button>
            </div>
          </div>
        )
      }
    </>
  );
}
