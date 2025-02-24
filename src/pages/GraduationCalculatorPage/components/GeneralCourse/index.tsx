/* eslint-disable jsx-a11y/control-has-associated-label */
import useTokenState from 'utils/hooks/state/useTokenState';
import useGeneralEducation from 'pages/GraduationCalculatorPage/hooks/useGeneralEducation';
import QuestionMarkIcon from 'assets/svg/question-mark-icon.svg';
import CompletedIcon from 'assets/svg/ellipse-icon-green.svg';
import NotCompletedIcon from 'assets/svg/ellipse-icon-red.svg';
import CloseIcon from 'assets/svg/common/close/close-icon-grey.svg';
import BubbleTailBottom from 'assets/svg/bubble-tail-bottom.svg';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import GeneralCourseListModal from './GeneralCourseListModal';
import styles from './GeneralCourse.module.scss';

function GeneralCourse({ frameId }: { frameId: number }) {
  const [isTooltipOpen, openTooltip, closeTooltip] = useBooleanState(false);
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);
  const token = useTokenState();
  const { generalEducation } = useGeneralEducation(token);
  const requiredEducationArea = generalEducation.required_education_area;

  return (
    <div className={styles['general-course']}>
      <div className={styles.description}>
        <div className={styles.description__title}>교양영역</div>
        <div className={styles.description__message}>현재 이수한 교양 강의가 영역별로 나타납니다.</div>
      </div>
      <button
        type="button"
        className={styles['question-icon']}
        onClick={openTooltip}
      >
        <QuestionMarkIcon />
      </button>
      <div className={styles.list}>
        {requiredEducationArea.map((track) => (
          <div key={track.courseType} className={styles.course}>
            <button
              type="button"
              onClick={openModal}
              className={styles.course__button}
            >
              { track.isCompleted ? <CompletedIcon /> : <NotCompletedIcon /> }
              <div className={styles.course__track}>{track.courseType}</div>
            </button>
            <div className={styles.course__enrolled}>{track.courseName}</div>
          </div>
        ))}
      </div>
      {isTooltipOpen && (
        <div className={styles.tooltip}>
          <div className={styles['tooltip-content']}>
            교양 영역을 클릭해서
            <strong> 학기 교양 개설 목록</strong>
            <br />
            을 확인할 수 있어요.
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
      {isModalOpen && (
        <GeneralCourseListModal
          frameId={frameId}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default GeneralCourse;
