import type { LectureInfo, TimetableLectureInfo } from 'interfaces/Lecture';
import React from 'react';
import { FixedSizeList as List } from 'react-window';
import { cn } from '@bcsdlab/utils';
import styles from './LectureTable.module.scss';

interface LectureTableProps {
  list: Array<LectureInfo> | Array<TimetableLectureInfo>;
  height: number;
  myLectures: Array<LectureInfo> | Array<TimetableLectureInfo>;
  onHover: ((value: LectureInfo | TimetableLectureInfo | null) => void);
  onClickRow: ((value: LectureInfo | TimetableLectureInfo) => void) | undefined;
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

const isLectureInfo = (value: LectureInfo | TimetableLectureInfo): value is LectureInfo => 'name' in value;

const useFlexibleWidth = (length: number, initialValue: number[]) => {
  const [widthInfo] = React.useState(() => initialValue);
  // TODO: flexible width 생성(mouseMove 이벤트)
  return {
    widthInfo,
  };
};

function LectureTable({
  list,
  height,
  myLectures,
  onHover,
  onClickRow,
}: LectureTableProps): JSX.Element {
  const { widthInfo } = useFlexibleWidth(9, [65, 173, 45, 65, 65, 45, 45, 45, 65]);
  const handleHover = (value: LectureInfo | TimetableLectureInfo | null) => {
    if (onHover !== null) {
      if (value !== null) {
        onHover(value);
      } else {
        onHover(null);
      }
    }
  };
  const handleTableRowClick = (
    value: LectureInfo | TimetableLectureInfo,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (e.detail === 1 && onClickRow !== undefined) {
      onClickRow(value);
    }
  };
  return (
    <div className={styles.table}>
      <div className={styles.table__content} role="table">
        <div className={styles.table__header} role="row">
          {LECTURE_TABLE_HEADER.map((header, headerIndex) => (
            <div
              style={{
                width: `${widthInfo[headerIndex]}px`,
              }}
              className={cn({
                [styles.table__col]: true,
                [styles['table__col--header']]: true,
              })}
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
        <List
          width={613}
          height={height}
          itemSize={34}
          itemCount={list.length}
          itemData={list}
        >
          {({ index, data: items, style }) => {
            const currentItem = items[index];
            return (
              <div
                className={cn({
                  [styles.table__row]: true,
                  [styles['table__row--include']]: myLectures.some((item) => item.code === currentItem.code && item.lecture_class === currentItem.lecture_class),
                })}
                role="row"
                key={`${currentItem.code}-${currentItem.lecture_class}`}
                style={style}
              >
                <button
                  type="button"
                  role={onClickRow !== undefined ? undefined : 'null'}
                  aria-label={onClickRow !== undefined ? '시간표에서 미리 보기' : undefined}
                  className={styles['table__row-button']}
                  onClick={(e) => handleTableRowClick(currentItem, e)}
                  onMouseEnter={() => handleHover(currentItem)}
                  onMouseLeave={() => handleHover(null)}
                >
                  {LECTURE_TABLE_HEADER
                    .map((headerItem, headerItemIndex) => (headerItem.key !== null
                      && (
                        <div
                          style={{
                            width: `${widthInfo[headerItemIndex]}px`,
                          }}
                          className={cn({
                            [styles.table__col]: true,
                            [styles['table__col--body']]: true,
                          })}
                          role="cell"
                          key={headerItem.key}
                        >
                          {headerItem.key === 'professor' && (currentItem[headerItem.key] === '' ? '미배정' : currentItem[headerItem.key])}
                          {headerItem.key === null && '수정'}
                          {headerItem.key === 'name' && isLectureInfo(currentItem) && currentItem.name}
                          {headerItem.key === 'name' && !isLectureInfo(currentItem) && currentItem.class_title}
                          {headerItem.key !== null && headerItem.key !== 'professor' && headerItem.key !== 'name' && currentItem[headerItem.key]}
                        </div>
                      )))}
                </button>
              </div>
            );
          }}
        </List>
      </div>
    </div>
  );
}

export default LectureTable;
