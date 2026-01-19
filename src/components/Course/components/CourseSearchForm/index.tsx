import React from 'react';
import { Semester } from 'api/timetable/entity';
import { DEPARTMENTS } from 'components/Course/constants';
import styles from './CourseSearchForm.module.scss';

interface StudentInfo {
  studentNumber: string;
  name: string;
}

interface CourseSearchFormProps {
  formInputs: {
    name: string;
    department: string;
  };
  semester: Semester;
  studentInfo: StudentInfo;
  onSearch: (e?: React.FormEvent) => void;
  onDepartmentChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CourseSearchForm({
  formInputs,
  semester,
  studentInfo,
  onSearch,
  onDepartmentChange,
  onNameChange,
}: CourseSearchFormProps) {
  return (
    <div className={styles.search}>
      <form className={styles.search__form} onSubmit={onSearch}>
        <div className={styles.search__group}>
          <label htmlFor="course-type" className={styles.search__label}>
            이수구분
          </label>
          <select id="course-type" className={styles.search__select}>
            <option>(전체)</option>
          </select>
        </div>

        <div className={styles.search__group}>
          <label htmlFor="department" className={styles.search__label}>
            개설학부(과)
          </label>
          <select
            id="department"
            className={styles.search__select}
            value={formInputs.department || '(전체)'}
            onChange={onDepartmentChange}
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className={styles.search__group}>
          <label htmlFor="year" className={`${styles.search__label} ${styles['search__label--required']}`}>
            학년도
          </label>
          <input id="year" className={styles.search__input} type="text" value={semester.year} disabled />
        </div>

        <div className={styles.search__group}>
          <label htmlFor="semester" className={`${styles.search__label} ${styles['search__label--required']}`}>
            학기구분
          </label>
          <input id="semester" className={styles.search__input} type="text" value={semester.term} disabled />
        </div>

        <div className={styles.search__group}>
          <label htmlFor="course-name" className={styles.search__label}>
            개설과목
          </label>
          <input
            id="course-name"
            className={styles.search__input}
            type="text"
            placeholder="과목명 또는 코드"
            value={formInputs.name}
            onChange={onNameChange}
          />
        </div>

        <div className={styles.search__group} aria-hidden="true" />

        <div className={styles.search__group}>
          <label htmlFor="student-id" className={`${styles.search__label} ${styles['search__label--required']}`}>
            학번
          </label>
          <input
            id="student-id"
            className={styles.search__input}
            type="text"
            value={studentInfo.studentNumber}
            disabled
          />
        </div>

        <div className={styles.search__group}>
          <label htmlFor="student-name" className={`${styles.search__label} ${styles['search__label--required']}`}>
            이름
          </label>
          <input id="student-name" className={styles.search__input} type="text" value={studentInfo.name} disabled />
        </div>
      </form>
    </div>
  );
}
