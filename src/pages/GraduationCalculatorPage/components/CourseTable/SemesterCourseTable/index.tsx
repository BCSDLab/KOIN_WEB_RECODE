/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { cn } from '@bcsdlab/utils';
import styles from './SemesterCourseTable.module.scss';

export interface SemesterCourseTableProps {
  tableData: React.ReactNode[][];
  isViewMode?: boolean;
}

function SemesterCourseTable({
  tableData,
  isViewMode,
}: SemesterCourseTableProps) {
  return (
    <table
      className={cn({
        [styles.table]: true,
        [styles['table--view']]: !!isViewMode,
      })}
    >
      <thead className={styles.table__header}>
        <tr>
          <th>과목명</th>
          <th>교수명</th>
          <th>학점</th>
          <th>이수구분</th>
          <th>{' '}</th>
        </tr>
      </thead>
      <tbody className={styles.table__body}>
        {tableData.length > 0 ? (
          tableData.map((row) => (
            <tr>
              {row.map((cell) => (
                <td>{cell}</td>
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
