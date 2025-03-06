/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect } from 'react';
import { useSemester } from 'utils/zustand/semester';
import useTokenState from 'utils/hooks/state/useTokenState';
import useTimetableFrameList from 'pages/TimetablePage/hooks/useTimetableFrameList';
import CloseIcon from 'assets/svg/common/close/close-icon-grey.svg';
import QuestionMarkIcon from 'assets/svg/question-mark-icon.svg';
import BubbleTailBottom from 'assets/svg/bubble-tail-bottom.svg';
import AcademicCapIcon from 'assets/svg/academic-cap-icon.svg';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import useBooleanState from 'utils/hooks/state/useBooleanState';
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
  const semester = useSemester();
  const { data: timetableFrameList } = useTimetableFrameList(token, semester);
  const [isTooltipOpen, openTooltip, closeTooltip] = useBooleanState(false);
  const mainFrame = timetableFrameList.find(
    (frame) => frame.is_main === true,
  );
  const { mutate: agreeGraduationCreidts } = useAgreeGraduationCreidts(token);
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
    openTooltip();
  }, []);

  useEffect(() => {
    if (!token) return;

    const isFirstVisit = sessionStorage.getItem('visitedGraduationPage');

    if (!isFirstVisit) {
      sessionStorage.setItem('visitedGraduationPage', 'true');

      portalManager.open(() => (
        <CalculatorHelpModal closeInfo={portalManager.close} />
      ));
    }
  }, [token]);

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
          {isTooltipOpen && (
            <div className={styles.tooltip}>
              <div className={styles['tooltip-content']}>
                이곳을 눌러
                <strong> 가이드</strong>
                를 확인할 수 있어요.
              </div>
              <button
                type="button"
                aria-label="close"
                className={styles['tooltip-close']}
                onClick={closeTooltip}
              >
                <CloseIcon />
              </button>
              <div className={styles['tooltip-asset']}>
                <BubbleTailBottom />
              </div>
            </div>
          )}
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
            <CreditChart />
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
