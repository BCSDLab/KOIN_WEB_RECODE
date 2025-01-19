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
          <h1 className={styles.header__title}>졸업학점 계산기</h1>
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
            <div className={styles.content__description}>
              <p className={styles['content__description-title']}>
                <strong>아우누리</strong>
                에서 받은 엑셀을 넣을 수 있어요.
              </p>
              <p className={styles['content__description-title']}>
                이수구분 등 잘못된 정보를 정정하면 아래의 그래프에 바로 적용돼요.
              </p>
            </div>
            <GeneralCourse />
            <CreditChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GraduationCalculatorPage;
