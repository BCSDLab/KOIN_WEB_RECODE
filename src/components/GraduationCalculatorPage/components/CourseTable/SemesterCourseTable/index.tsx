import React from 'react';

import EllipsisTooltip from 'components/GraduationCalculatorPage/components/CourseTable/EllipsisTooltip';

import styles from './SemesterCourseTable.module.scss';

export interface SemesterCourseTableProps {
  tableData: React.ReactNode[][];
  rowKeys?: Array<string | number>;
  hasProfessor?: boolean;
}

function SemesterCourseTable({ tableData, rowKeys, hasProfessor = true }: SemesterCourseTableProps) {
  return (
    <table className={styles.table}>
      <thead className={styles.table__header}>
        <tr>
          <th>과목명</th>
          <th>{hasProfessor ? '교수명' : ''}</th>
          <th>학점</th>
          <th>이수구분</th>
          <th> </th>
        </tr>
      </thead>
      <tbody className={styles.table__body}>
        {tableData.length > 0 ? (
          tableData.map((row, rowIndex) => (
            // 행 삭제로 목록 중간이 비면 index만으로는 다른 행과 뒤섞일 수 있어, 호출부가 넘긴 안정적인 rowKeys를 우선 사용한다.
            <tr key={rowKeys?.[rowIndex] ?? `row-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                // eslint-disable-next-line react/no-array-index-key -- 열은 항상 고정된 5개 위치(과목명/교수명/학점/이수구분/삭제)라 재정렬되지 않는다.
                <td key={`cell-${rowIndex}-${cellIndex}`}>
                  {cellIndex <= 1 ? <EllipsisTooltip text={cell}>{cell}</EllipsisTooltip> : cell}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>등록된 강의가 없습니다.</tr>
        )}
      </tbody>
    </table>
  );
}

export default SemesterCourseTable;
