import SemesterList from 'pages/TimetablePage/components/SemesterList';
/* eslint-disable jsx-a11y/control-has-associated-label */
import CloseIcon from 'assets/svg/modal-close-icon.svg';
import styles from './CourseTable.module.scss';

function CourseTable() {
  return (
    <div className={styles['lecture-table']}>
      <div className={styles.semester}>
        <SemesterList />
      </div>
      <div className={styles.table}>
        <table className={styles.table__content}>
          <thead className={styles['table__content--header']}>
            <tr>
              <th className={styles['table__content--header-column']}>과목명</th>
              <th className={styles['table__content--header-column']}>교수명</th>
              <th className={styles['table__content--header-column']}>학점</th>
              <th className={styles['table__content--header-column']}>이수구분</th>
              <th className={styles['table__content--header-column']}>{' '}</th>
            </tr>
          </thead>
          <tbody className={styles['table__content--body']}>
            {/* map 으로 불러오기 */}
            <tr className={styles['table__content--body-row']}>
              <th className={styles['table__content--body-column']}>과목명최대길이10글자</th>
              <th className={styles['table__content--body-column']}>김교수</th>
              <th className={styles['table__content--body-column']}>4</th>
              <th className={styles['table__content--body-column']}>학부(전공)선택</th>
              <th
                className={styles['table__content--body-column']}
              >
                <button type="button"><CloseIcon /></button>
              </th>
            </tr>
          </tbody>
        </table>
        <button
          type="button"
          className={styles.table__trigger}
        >
          강의 추가하기
        </button>
      </div>
    </div>
  );
}

export default CourseTable;
