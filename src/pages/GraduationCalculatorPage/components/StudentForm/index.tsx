import Listbox from 'components/TimetablePage/Listbox';
import useDeptList from 'pages/Auth/SignupPage/hooks/useDeptList';
import { useState } from 'react';
import { useUser } from 'utils/hooks/state/useUser';
import styles from './StudentForm.module.scss';

function StudentForm() {
  const user = useUser();
  const { data: deptList } = useDeptList();
  const deptOptionList = deptList.map((dept) => ({
    label: dept.name,
    value: dept.name,
  }));
  // 학과에 따른 전공을 불러오는 api 필요
  // cosnt { data: deptInfo } = useDeptInfo(department);

  // request로 '메카트로닉스공학부' 입력해서 얻은 응답값
  const deptInfo = {
    dept_num: '40',
    name: '메카트로닉스공학부',
    major: ['생산시스템전공', '제어시스템전공', '디지털시스템전공'],
  };

  const majorOptionList = deptInfo.major.map((major) => ({ label: major, value: major }));

  const [
    studentNumber, setStudentNumber,
  ] = useState<string | null>(user.data?.student_number ?? null);
  const [
    department, setDepartment,
  ] = useState<string | null>(user.data?.major ?? null);
  const [major, setMajor] = useState<string | null>(null);

  const handleStudentNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentNumber(e.target.value);
  };

  return (
    <div className={styles['student-form']}>
      <div className={styles['student-form__input']}>
        <div>내 정보</div>
        <button type="button" className={styles['student-form__button']}>저장하기</button>
      </div>
      <div className={styles['student-form__input']}>
        <div>학번</div>
        <input
          className={styles['student-form__student-number']}
          value={studentNumber ?? ''}
          onChange={handleStudentNumber}
        />
      </div>
      <div className={styles['student-form__input']}>
        <div>학과</div>
        <div className={styles['student-form__department']}>
          <Listbox
            list={deptOptionList}
            value={department}
            onChange={({ target }) => setDepartment(target.value)}
            version="new"
          />
        </div>
      </div>
      <div className={styles['student-form__input']}>
        <div>전공</div>
        <div className={styles['student-form__major']}>
          <Listbox
            list={majorOptionList}
            value={major}
            onChange={({ target }) => setMajor(target.value)}
            version="new"
          />
        </div>
      </div>
    </div>
  );
}

export default StudentForm;
