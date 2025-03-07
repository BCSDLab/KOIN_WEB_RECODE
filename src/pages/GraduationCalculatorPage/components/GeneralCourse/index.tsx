/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { startTransition, useEffect, useState } from 'react';
import { Portal } from 'components/common/Modal/PortalProvider';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
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

function GeneralCourse() {
  const portalManager = useModalPortal();
  const [isTooltipOpen, openTooltip, closeTooltip] = useBooleanState(false);
  const token = useTokenState();
  const { generalEducation } = useGeneralEducation(token);
  const requiredEducationArea = generalEducation?.general_education_area || [];
  const [selectedCourseType, setSelectedCourseType] = useState<string | null>(null);

  const handleOpenModal = (courseType: string) => {
    setSelectedCourseType(courseType);
    startTransition(() => portalManager.open((portalOption: Portal) => (
      <GeneralCourseListModal
        courseType={selectedCourseType}
        onClose={portalOption.close}
      />
    )));
  };

  useEffect(() => {
    openTooltip();
  }, []);

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
          <div key={track.course_type} className={styles.course}>
            <button
              type="button"
              onClick={() => handleOpenModal(track.course_type)}
              className={styles.course__button}
            >
              { track.required_credit <= track.completed_credit
                ? <CompletedIcon /> : <NotCompletedIcon /> }
              <div className={styles.course__track}>{track.course_type}</div>
            </button>
            <div className={styles.course__enrolled}>
              {/* eslint-disable-next-line no-nested-ternary */}
              {track.course_type === '교양선택' || track.course_type === '인성과소양'
                ? `${track.completed_credit ?? 0} / ${track.required_credit ?? 0}`
                : Array.isArray(track.course_names) && track.course_names.length > 0
                  ? track.course_names[0]
                  : ''}
            </div>
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
    </div>
  );
}

export default GeneralCourse;
