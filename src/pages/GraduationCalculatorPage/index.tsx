/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import AcademicCapIcon from 'assets/svg/academic-cap-icon.svg';
import QuestionMarkIcon from 'assets/svg/question-mark-icon.svg';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import styles from './GraduationCalculatorPage.module.scss';
import StudentForm from './components/StudentForm';
import LectureTable from './components/LectureTable';
import ExcelUploader from './components/ExcelUploader';
import GeneralCourse from './components/GeneralCourse';
import CreditChart from './components/CreditChart';
import CalculatorHelpModal from './CalculatorHelpModal';

function GraduationCalculatorPage() {
  const portalManager = useModalPortal();
  // const [isOpenModal, openModal, closeModal] = useBooleanState(false);

  const handleInformationClick = () => {
    portalManager.open(() => (
      <CalculatorHelpModal closeInfo={portalManager.close} />
    ));
  };

  return (
    <div className={styles.page}>
      <div className={styles.graduation}>
        <div className={styles.header}>
          <div className={styles['header__cap-icon']}>
            <AcademicCapIcon />
          </div>
          <h1 className={styles.header__title}>졸업학점 계산기</h1>
          <button
            type="button"
            onClick={() => handleInformationClick()}
            className={styles['header__question-icon']}
          >
            <QuestionMarkIcon />
          </button>
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
