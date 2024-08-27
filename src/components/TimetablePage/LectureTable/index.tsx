import type { LectureInfo, TimetableLectureInfoV2 } from 'interfaces/Lecture';
import React from 'react';
import { ReactComponent as LectureCloseIcon } from 'assets/svg/lecture-close-icon.svg';
import { cn } from '@bcsdlab/utils';
import { useTempLecture, useTempLectureAction } from 'utils/zustand/myTempLectureV2';
import useOnClickOutside from 'utils/hooks/useOnClickOutside';
import useToast from 'components/common/Toast/useToast';
import useTimetableV2Mutation from 'pages/Timetable/hooks/useTimetableV2Mutation';
import styles from './LectureTable.module.scss';

interface LectureTableProps {
  frameId: number;
  list: Array<LectureInfo> | Array<TimetableLectureInfoV2>;
  myLecturesV2: Array<LectureInfo> | Array<TimetableLectureInfoV2> | undefined;
  selectedLecture:LectureInfo | TimetableLectureInfoV2 | undefined;
  onClickRow: ((value:LectureInfo | TimetableLectureInfoV2) => void) | undefined;
  onDoubleClickRow: ((value: LectureInfo | TimetableLectureInfoV2) => void) | undefined;
  version: 'semesterLectureList' | 'myLectureList'
}

interface RemoveLectureProps {
  lecture_class: string;
  professor: string;
}

const LECTURE_TABLE_HEADER = [
  { key: 'code', label: '코드' },
  { key: 'name', label: '과목명' },
  { key: 'lecture_class', label: '분반' },
  { key: 'professor', label: '담당교수' },
  { key: 'target', label: '대상' },
  { key: 'grades', label: '학점' },
  { key: 'regular_number', label: '정원' },
  { key: 'design_score', label: '설계' },
  { key: 'department', label: '개설학부' },
] as const;

const isLectureInfo = (
  value: LectureInfo | TimetableLectureInfoV2,
): value is LectureInfo => 'name' in value;

const useFlexibleWidth = (length: number, initialValue: number[]) => {
  const [widthInfo] = React.useState(() => initialValue);
  // TODO: flexible width 생성(mouseMove 이벤트)
  return {
    widthInfo,
  };
};

function LectureTable({
  frameId,
  list,
  myLecturesV2,
  selectedLecture,
  onClickRow,
  onDoubleClickRow,
  version,
}: LectureTableProps): JSX.Element {
  const { widthInfo } = useFlexibleWidth(9, [61, 173, 41, 61, 61, 41, 41, 41, 61]);
  const tempLecture = useTempLecture();
  const { updateTempLecture } = useTempLectureAction();
  const [cursor, setCursor] = React.useState(-1);
  const { target } = useOnClickOutside<HTMLDivElement>(
    () => {
      updateTempLecture(null);
      setCursor(-1);
    },
  );
  const toast = useToast();
  const { removeMyLectureV2 } = useTimetableV2Mutation(frameId);
  const handleRemoveLectureClick = ({ lecture_class, professor }: RemoveLectureProps) => {
    const recoverLecture = () => {

    };
    let lectureToRemove: LectureInfo | TimetableLectureInfoV2 | null = null;
    (myLecturesV2 || list).forEach((lecture) => {
      if (lecture.lecture_class === lecture_class && lecture.professor === professor) {
        lectureToRemove = lecture;
      }
    });
    if (lectureToRemove) {
      removeMyLectureV2(lectureToRemove, frameId);
      toast.open({ message: '해당 과목이 삭제되었습니다.', recoverMessage: '해당 과목이 복구되었습니다.', onRecover: recoverLecture });
    }
  };
  const [isMouseOver, setIsMouseOver] = React.useState(-1);
  const handleTableRowClick = (
    value: LectureInfo | TimetableLectureInfoV2,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (e.detail === 1 && onClickRow !== undefined) {
      onClickRow(value);
    }
    if (e.detail === 2 && onDoubleClickRow !== undefined) {
      onDoubleClickRow(value);
      if (tempLecture !== null && onClickRow !== undefined) {
        onClickRow(value);
      }
    }
  };
  function useKeyboardEvent() {
    React.useEffect(() => {
      function keyboardNavigation(e: KeyboardEvent) {
        if (tempLecture && onClickRow !== undefined) {
          if (e.key === 'ArrowDown') {
            if (cursor < list.length - 1) {
              e.preventDefault();
              onClickRow(list[cursor + 1]);
              setCursor((prev) => prev + 1);
            }
          }
          if (e.key === 'ArrowUp') {
            if (cursor > 0) {
              e.preventDefault();
              onClickRow(list[cursor - 1]);
              setCursor((prev) => prev - 1);
            }
          }
          if (e.key === 'Escape') {
            updateTempLecture(null);
            setCursor(-1);
          }
          if (e.key === 'Enter' && cursor > 0 && onDoubleClickRow !== undefined) {
            e.preventDefault();
            onDoubleClickRow(list[cursor]);
          }
        }
      }
      window.addEventListener('keydown', keyboardNavigation, true);
      return () => {
        window.removeEventListener('keydown', keyboardNavigation, true);
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cursor]);
  }
  useKeyboardEvent();
  React.useEffect(() => {
    if (target.current) {
      const selectedList = target.current.children[cursor];
      selectedList?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor]);

  return (
    <div className={styles.table}>
      <div className={styles.table__content} role="table">
        <div className={styles.table__header} role="row">
          {LECTURE_TABLE_HEADER.map((header, headerIndex) => (
            <div
              style={{
                width: `${widthInfo[headerIndex]}px`,
              }}
              className={styles.table__col}
              role="columnheader"
              key={header.key}
            >
              {header.label}
              {/* 내림차순 기능 추가할때 다시 복구 */}
              {/* {headerIndex !== LECTURE_TABLE_HEADER.length - 1 && (
                <>
                  <button type="button" className={styles.table__button}>
                    <img src="https://static.koreatech.in/assets/img/ic-arrow-down.png" alt="내림차순" />
                  </button>
                  <div className={styles.table__resize} aria-hidden />
                </>
              )} */}
            </div>
          ))}
        </div>
        <div className={styles['table__lecture-list']} ref={target}>
          {list.map((lecture, index) => (
            <div
              className={cn({
                [styles.table__row]: true,
                [styles['table__row--include']]: myLecturesV2 ? myLecturesV2.some(
                  (item) => item.code === lecture.code
                      && item.lecture_class === lecture.lecture_class,
                ) : false,
                [styles['table__row--selected']]: selectedLecture === lecture,
              })}
              aria-selected={selectedLecture === lecture}
              role="row"
              key={`${lecture.code}-${lecture.lecture_class}`}
            >
              <button
                type="button"
                role={onClickRow !== undefined ? undefined : 'null'}
                aria-label={
                    onClickRow !== undefined
                      ? '시간표에서 미리 보기'
                      : undefined
                  }
                className={cn({
                  [styles['table__row-button']]: true,
                  [styles['table__row-button--toggled']]: version === 'myLectureList',
                })}
                onClick={(e) => {
                  setCursor(index);
                  handleTableRowClick(lecture, e);
                }}
                onMouseEnter={() => setIsMouseOver(index)}
                onMouseLeave={() => setIsMouseOver(-1)}
              >
                {isMouseOver === index && version === 'myLectureList' && (
                  <div className={styles['table__delete-button']}>
                    <LectureCloseIcon
                      onClick={() => {
                        handleRemoveLectureClick({
                          lecture_class: lecture.lecture_class,
                          professor: lecture.professor,
                        });
                      }}
                    />
                  </div>
                )}
                {LECTURE_TABLE_HEADER.map(
                  (headerItem, headerItemIndex) => headerItem.key !== null && (
                    <div
                      style={{
                        width: `${widthInfo[headerItemIndex]}px`,
                      }}
                      className={cn({
                        [styles.table__col]: true,
                        [styles['table__col--text-center']]:
                              headerItem.label === '분반'
                              || headerItem.label === '학점'
                              || headerItem.label === '정원'
                              || headerItem.label === '설계',
                      })}
                      role="cell"
                      key={headerItem.key}
                    >
                      {headerItem.key === 'professor'
                            && (lecture[headerItem.key] === ''
                              ? '미배정'
                              : lecture[headerItem.key])}
                      {headerItem.key === null && '수정'}
                      {headerItem.key === 'name'
                            && isLectureInfo(lecture)
                            && lecture.name}
                      {headerItem.key === 'name'
                            && !isLectureInfo(lecture)
                            && lecture.class_title}
                      {headerItem.key !== null
                            && headerItem.key !== 'professor'
                            && headerItem.key !== 'name'
                            && lecture[headerItem.key]}
                    </div>
                  ),
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LectureTable;
