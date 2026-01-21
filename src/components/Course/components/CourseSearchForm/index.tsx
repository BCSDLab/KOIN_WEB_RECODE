import React from 'react';
import { Semester } from 'api/timetable/entity';
import { useUser } from 'utils/hooks/state/useUser';
import { isStudentUser } from 'utils/ts/userTypeGuards';
import styles from './CourseSearchForm.module.scss';

const DEPARTMENTS = [
  '(전체)',
  '컴퓨터공학부',
  '기계공학부',
  '메카트로닉스공학부',
  '전기ㆍ전자ㆍ통신공학부',
  '디자인ㆍ건축공학부',
  '에너지신소재화학공학부',
  '산업경영학부',
  '교양학부',
  '미래융합학부',
  '고용서비스정책학과',
  'HRD학과',
];

interface CourseSearchFormProps {
  formInputs: {
    name: string;
    department: string;
  };
  semester: Semester;
  onSearch: (e?: React.FormEvent) => void;
  onDepartmentChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CourseSearchForm({
  formInputs,
  semester,
  onSearch,
  onDepartmentChange,
  onNameChange,
}: CourseSearchFormProps) {
  const { data: user } = useUser();

  const studentInfo = {
    studentNumber: isStudentUser(user) ? user.student_number : '',
    name: user?.name ?? '',
  };

  return (
    <form onSubmit={onSearch}>
      <div className={styles.header}>
        <button type="submit" className={styles.header__button}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.header__icon}
            src="https://kut90.koreatech.ac.kr/nxweb/images/common/Button/btn_search.png"
            alt="조회"
          />
          조회
        </button>
        <button type="button" className={styles.header__button}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.header__icon}
            src="https://kut90.koreatech.ac.kr/nxweb/images/common/Button/btn_help.png"
            alt="도움말"
          />
          도움말
        </button>
        <button type="button" className={styles.header__button}>
          메인으로
        </button>
      </div>

      <div className={styles.search}>
        <div className={styles.search__form}>
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
        </div>
      </div>
    </form>
  );
}
