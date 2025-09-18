import { Lecture, MyLectureInfo } from 'api/timetable/entity';
import React from 'react';
import LectureCloseIcon from 'assets/svg/lecture-close-icon.svg';
import LectureEditIcon from 'assets/svg/lecture-edit-icon.svg';
import { cn } from '@bcsdlab/utils';
import useTimetableMutation from 'components/TimetablePage/hooks/useTimetableMutation';
import { useTempLecture, useTempLectureAction } from 'utils/zustand/myTempLecture';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';
import { useRouter } from 'next/router';
import styles from './LectureTable.module.scss';

interface LectureTableProps {
  rowWidthList: number[];
  timetableFrameId: number;
  list: Array<Lecture> | Array<MyLectureInfo>;
  myLectures: Array<Lecture> | Array<MyLectureInfo>;
  selectedLecture: Lecture | undefined;
  onClickRow: ((value: Lecture | MyLectureInfo) => void) | undefined;
  onDoubleClickRow: ((value: Lecture | MyLectureInfo) => void) | undefined;
  version: 'semesterLectureList' | 'myLectureList'
}

interface RemoveLectureProps {
  id: number;
}

export const LECTURE_TABLE_HEADER = [
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

function LectureTable({
  rowWidthList,
  timetableFrameId,
  list,
  myLectures,
  selectedLecture,
  onClickRow,
  onDoubleClickRow,
  version,
}: LectureTableProps): JSX.Element {
  const router = useRouter();
  const navigate = router.push;
  const tempLecture = useTempLecture(); // 이거 selectedLecture랑 같을 수 있음
  const { updateTempLecture } = useTempLectureAction();
  const [cursor, setCursor] = React.useState(-1);
  const token = useTokenState();
  const { containerRef } = useOutsideClick({
    onOutsideClick: () => {
      updateTempLecture(null);
      setCursor(-1);
    },
  });

  const handleEditLectureClick = (lectureIndex: number) => {
    if (!token) {
      showToast('info', '강의 수정은 로그인 후 이용할 수 있습니다.');
      return;
    }

    navigate(`/timetable/modify/direct/${timetableFrameId}?lectureIndex=${lectureIndex}`);
  };

  const { removeMyLecture } = useTimetableMutation(timetableFrameId);
  const handleRemoveLectureClick = ({ id }: RemoveLectureProps) => {
    myLectures.forEach((lecture) => {
      if (lecture.id === id) {
        removeMyLecture.mutate({ clickedLecture: lecture, id });
      }
    });
  };
  const [isMouseOver, setIsMouseOver] = React.useState(-1);
  const handleTableRowClick = (
    value: Lecture | MyLectureInfo,
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
          if (e.key === 'Enter' && cursor >= 0 && onDoubleClickRow !== undefined) {
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
    if (containerRef.current) {
      const selectedList = containerRef.current.children[cursor];
      selectedList?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor]);
  return (
    <div className={styles.table}>
      <div className={styles['table__lecture-list']} ref={containerRef}>
        {list.map((lecture, index) => (
          <div
            className={cn({
              [styles.table__row]: true,
              [styles['table__row--include']]: (version === 'semesterLectureList' && myLectures) ? myLectures.some(
                (item) => item.code === lecture.code
                  && item.lecture_class === lecture.lecture_class,
              ) : false,
              [styles['table__row--selected']]: selectedLecture === lecture,
            })}
            aria-selected={selectedLecture === lecture}
            role="row"
            key={lecture.id}
          >
            <button
              type="button"
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
                <>
                  <div
                    className={styles['table__edit-button']}
                    onClick={() => handleEditLectureClick(index)}
                    role="button"
                    aria-hidden
                  >
                    <LectureEditIcon />
                  </div>
                  <div
                    className={styles['table__delete-button']}
                    onClick={() => {
                      handleRemoveLectureClick({
                        id: lecture.id,
                      });
                    }}
                    role="button"
                    aria-hidden
                  >
                    <LectureCloseIcon />
                  </div>
                </>
              )}
              {LECTURE_TABLE_HEADER.map(
                (headerItem, headerItemIndex) => headerItem.key !== null && (
                  <div
                    style={{
                      width: `${rowWidthList[headerItemIndex]}px`,
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
                      && 'name' in lecture
                      && lecture.name}
                    {headerItem.key === 'name'
                      && 'class_title' in lecture
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
  );
}

export default LectureTable;
