/* eslint-disable jsx-a11y/control-has-associated-label */
import QuestionMarkIcon from 'assets/svg/question-mark-icon.svg';
import CourseStatusIcon from 'assets/svg/ellipse-icon.svg';
import CloseIcon from 'assets/svg/common/close/close-icon-grey.svg';
import BubbleTailBottom from 'assets/svg/bubble-tail-bottom.svg';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import styles from './GeneralCourse.module.scss';

function GeneralCourse() {
  const [isTooltipOpen, openTooltip, closeTooltip] = useBooleanState(false);

  const tracks = [
    { id: 1, name: '교양 선택' },
    { id: 2, name: '예술과 문학' },
    { id: 3, name: '사회와 심리' },
    { id: 4, name: '역사와 철학' },
    { id: 5, name: '자연과 인간' },
    { id: 6, name: '인성과 소양' },
  ];

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
        {tracks.map((track) => (
          <div key={track.id} className={styles.course}>
            <button
              type="button"
              className={styles.course__button}
            >
              <CourseStatusIcon />
              <div className={styles.course__track}>{track.name}</div>
            </button>
            <div className={styles.course__enrolled}>과목명</div>
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
