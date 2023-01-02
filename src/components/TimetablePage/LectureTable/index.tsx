import { LectureInfo } from 'interfaces/Lecture';
import React from 'react';
import { FixedSizeList as List } from 'react-window';
import cn from 'utils/ts/classnames';
import styles from './LectureTable.module.scss';

interface LectureTableProps {
  list: Array<LectureInfo>;
  height: number;
  children: (props: { onClick: () => void }) => React.ReactNode | undefined;
  selectedLecture: LectureInfo | undefined;
  onClickRow: ((value: LectureInfo) => void) | undefined;
  onClickLastColumn: (value: LectureInfo) => void;
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
                  <button type="button" className={styles.table__button} aria-label="sibal">
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
          {({ index, data: items, style }) => (
            <div
              className={cn({
                [styles.table__row]: true,
                [styles['table__row--selected']]: selectedLecture === items[index],
              })}
              aria-selected={selectedLecture === items[index]}
              role="row"
              key={`${items[index].code}-${items[index].lecture_class}`}
              style={style}
            >
              <button
                type="button"
                role={onClickRow !== undefined ? undefined : 'null'}
                aria-label={onClickRow !== undefined ? '시간표에서 미리 보기' : undefined}
                className={styles['table__row-button']}
                onClick={onClickRow ? () => onClickRow(items[index]) : undefined}
              >
                {LECTURE_TABLE_HEADER.map((headerItem, headerItemIndex) => (headerItem.key !== null
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
                      {headerItem.key === 'professor' && (items[index][headerItem.key] === '' ? '미배정' : items[index][headerItem.key])}
                      {headerItem.key === null && '추가'}
                      {headerItem.key !== null && headerItem.key !== 'professor' && items[index][headerItem.key]}
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
                {children({ onClick: () => onClickLastColumn(items[index]) })}
              </div>
            </div>
          )}
        </List>
      </div>
    </div>
  );
}

export default LectureTable;
