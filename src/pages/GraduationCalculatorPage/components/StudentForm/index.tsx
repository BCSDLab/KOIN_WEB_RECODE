import Listbox, { ListboxRef } from 'components/TimetablePage/Listbox';
import { useEffect, useState } from 'react';
import { useUser } from 'utils/hooks/state/useUser';
import useUserInfoUpdate from 'utils/hooks/auth/useUserInfoUpdate';
import useDepartmentMajorList from 'pages/GraduationCalculatorPage/hooks/useDepartmentMajorList';
import useRemainingCredits from 'pages/GraduationCalculatorPage/hooks/useRemainingCredits';
import useTokenState from 'utils/hooks/state/useTokenState';
import styles from './StudentForm.module.scss';

function StudentForm() {
  const token = useTokenState();
  const { data: userInfo } = useUser();
  const { data: deptMajorList } = useDepartmentMajorList();
  const { mutate: calculateRemainingCredits } = useRemainingCredits(token);

  const [
    studentNumber, setStudentNumber,
  ] = useState<string>(userInfo?.student_number ?? '');
  const [
    department, setDepartment,
  ] = useState<string>(userInfo?.major ?? '');
  const [major, setMajor] = useState<string | null>(null);
  const [majorOptionList, setMajorOptionList] = useState<{ label: string, value: string }[]>([{ label: '', value: '' }]);

  const departmentOptionList = deptMajorList.map(
    (deptMajor) => ({ label: deptMajor.department, value: deptMajor.department }),
  );

  const handleStudentNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentNumber(e.target.value);
  };

  const handleMajor = (dept: string) => {
    const selectedDeptMajor = deptMajorList.find(
      (deptMajor) => deptMajor.department === dept,
    );
    const majorsOption = selectedDeptMajor!.majors.map(
      (majors) => ({ label: majors, value: majors }),
    );
    setMajorOptionList(majorsOption);
  };

  const handleDepartment = ({ target }: { target: ListboxRef }) => {
    setDepartment(target.value);
    handleMajor(target.value);
  };

  const onSuccess = () => {
    calculateRemainingCredits();
    // 그래프 학점 이수 구분 변경
    // 이수 교양 영역 변경
  };

  const { mutate: updateUserInfo } = useUserInfoUpdate({ onSuccess });

  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateUserInfo({
      ...userInfo,
      major: department,
      student_number: studentNumber,
    });
  };

  useEffect(() => {
    if (department) {
      handleMajor(department);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form onSubmit={onSubmitForm} className={styles['student-form']}>
      <div className={styles['student-form__input']}>
        <div>내 정보</div>
        <button type="submit" className={styles['student-form__button']}>저장하기</button>
      </div>
      <div className={styles['student-form__input']}>
        <div>학번</div>
        <input
          name="student-number"
          className={styles['student-form__student-number']}
          value={studentNumber ?? ''}
          onChange={handleStudentNumber}
        />
      </div>
      <div className={styles['student-form__input']}>
        <div>학과</div>
        <div className={styles['student-form__department']}>
          <Listbox
            list={departmentOptionList}
            value={department}
            onChange={handleDepartment}
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
    </form>
  );
}

export default StudentForm;
