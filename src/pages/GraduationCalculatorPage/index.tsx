/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import { useSemester } from 'utils/zustand/semester';
import useTokenState from 'utils/hooks/state/useTokenState';
import useTimetableFrameList from 'pages/TimetablePage/hooks/useTimetableFrameList';
import AcademicCapIcon from 'assets/svg/academic-cap-icon.svg';
import QuestionMarkIcon from 'assets/svg/question-mark-icon.svg';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import { useUser } from 'utils/hooks/state/useUser';
import styles from './GraduationCalculatorPage.module.scss';
import StudentForm from './components/StudentForm';
import CourseTable from './components/CourseTable';
import ExcelUploader from './components/ExcelUploader';
import GeneralCourse from './components/GeneralCourse';
import CreditChart from './components/CreditChart';
import CalculatorHelpModal from './CalculatorHelpModal';
import useAgreeGraduationCreidts from './hooks/useAgreeGraduationCreidts';
import GraduationCalculatorAuthModal from './components/GraduationCalculatorAuthModal';

function GraduationCalculatorPage() {
  const token = useTokenState();
  const { data: userInfo } = useUser();
  const semester = useSemester();
  const { data: timetableFrameList } = useTimetableFrameList(token, semester);
  const mainFrame = timetableFrameList.find(
    (frame) => frame.is_main === true,
  );
  const { mutate: agreeGraduationCreidts } = useAgreeGraduationCreidts(token, String(userInfo?.id));
  const currentFrameIndex = mainFrame?.id ? mainFrame.id : 0;
  const portalManager = useModalPortal();
  const handleInformationClick = () => {
    portalManager.open(() => (
      <CalculatorHelpModal closeInfo={portalManager.close} />
    ));
  };

  useEffect(() => {
    if (!token) return;

    agreeGraduationCreidts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <CourseTable frameId={currentFrameIndex} />
            <ExcelUploader />
          </div>
          <div className={styles.content__results}>
            <div className={styles.content__description}>
              <p className={styles['content__description-title']}>
                <a
                  href="https://portal.koreatech.ac.kr"
                  className={styles['content__description-title--link']}
                  target="_blank"
                  rel="noreferrer"
                >
                  아우누리
                </a>
                에서 받은 엑셀을 넣을 수 있어요.
              </p>
              <p className={styles['content__description-title']}>
                이수구분 등 잘못된 정보를 정정하면 아래의 그래프에 바로 적용돼요.
              </p>
            </div>
            <GeneralCourse />
            <CreditChart currentFrameIndex={currentFrameIndex} />
          </div>
        </div>
      </div>
      {!token && (
        <GraduationCalculatorAuthModal />
      )}
    </div>
  );
}

export default GraduationCalculatorPage;
