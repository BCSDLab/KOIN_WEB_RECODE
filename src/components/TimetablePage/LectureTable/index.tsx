import type { LectureInfo, TimetableLectureInfo } from 'interfaces/Lecture';
import React from 'react';
import { FixedSizeList as List } from 'react-window';
import cn from 'utils/ts/classnames';
import styles from './LectureTable.module.scss';

interface LectureTableProps {
  list: Array<LectureInfo> | Array<TimetableLectureInfo>;
  height: number;
  children: (props: { onClick: () => void }) => React.ReactNode | undefined;
  selectedLecture: LectureInfo | TimetableLectureInfo | undefined;
  onClickRow: ((value: LectureInfo | TimetableLectureInfo) => void) | undefined;
  onClickLastColumn: (value: LectureInfo | TimetableLectureInfo) => void;
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
  { key: null, label: '' },
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
  children,
  selectedLecture,
  onClickRow,
  onClickLastColumn,
}: LectureTableProps): JSX.Element {
  const { widthInfo } = useFlexibleWidth(10, [63, 207, 54, 76, 58, 58, 58, 58, 90, 40]);
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
              {headerIndex !== LECTURE_TABLE_HEADER.length - 1 && (
                <>
                  <button type="button" className={styles.table__button}>
                    <img src="https://static.koreatech.in/assets/img/ic-arrow-down.png" alt="내림차순" />
                  </button>
                  <div className={styles.table__resize} aria-hidden />
                </>
              )}
            </div>
          ))}
        </div>
        <List
          width={766}
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
                  [styles['table__row--even']]: index % 2 === 0,
                  [styles['table__row--selected']]: selectedLecture === currentItem,
                })}
                aria-selected={selectedLecture === currentItem}
                role="row"
                key={`${currentItem.code}-${currentItem.lecture_class}`}
                style={style}
              >
                <button
                  type="button"
                  role={onClickRow !== undefined ? undefined : 'null'}
                  aria-label={onClickRow !== undefined ? '시간표에서 미리 보기' : undefined}
                  className={styles['table__row-button']}
                  onClick={onClickRow ? () => onClickRow(currentItem) : undefined}
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
                <div
                  style={{
                    width: `${widthInfo[widthInfo.length - 1]}px`,
                  }}
                  className={cn({
                    [styles.table__col]: true,
                    [styles['table__col--body']]: true,
                  })}
                >
                  {children({ onClick: () => onClickLastColumn(currentItem) })}
                </div>
              </div>
            );
          }}
        </List>
      </div>
    </div>
  );
}

export default LectureTable;
