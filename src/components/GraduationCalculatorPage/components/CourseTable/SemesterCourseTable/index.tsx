import React from 'react';
import EllipsisTooltip from 'components/GraduationCalculatorPage/components/CourseTable/EllipsisTooltip';
import styles from './SemesterCourseTable.module.scss';

export interface SemesterCourseTableProps {
  tableData: React.ReactNode[][];
  hasProfessor?: boolean;
}

function SemesterCourseTable({ tableData, hasProfessor = true }: SemesterCourseTableProps) {
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
            <tr key={`row-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
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
