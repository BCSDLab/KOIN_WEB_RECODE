import React from 'react';
import AcademicCapIcon from 'assets/svg/academic-cap-icon.svg';
import QuestionMarkIcon from 'assets/svg/question-mark-icon.svg';
import styles from './GraduationCalculatorPage.module.scss';
import StudentForm from './components/StudentForm';
import LectureTable from './components/LectureTable';
import ExcelUploader from './components/ExcelUploader';
import GeneralCourse from './components/GeneralCourse';
import CreditChart from './components/CreditChart';

function GraduationCalculatorPage() {
  return (
    <div className={styles.page}>
      <div className={styles.graduation}>
        <div className={styles.header}>
          <div className={styles['header__cap-icon']}>
            <AcademicCapIcon />
          </div>
          <h1 className={styles['header-title']}>졸업학점 계산기</h1>
          <div className={styles['header__question-icon']}>
            <QuestionMarkIcon />
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.content__inputs}>
            <StudentForm />
            <LectureTable />
            <ExcelUploader />
          </div>
          <div className={styles.content__results}>
            <div className={styles.content__description}> </div>
            <GeneralCourse />
            <CreditChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GraduationCalculatorPage;
