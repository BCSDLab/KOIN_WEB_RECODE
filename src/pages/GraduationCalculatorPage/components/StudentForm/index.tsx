import { useEffect, useState } from 'react';
import useLogger from 'utils/hooks/analytics/useLogger';
import useUserAcademicInfo from 'utils/hooks/state/useUserAcademicInfo';
import useDepartmentMajorList from 'pages/GraduationCalculatorPage/hooks/useDepartmentMajorList';
import useTokenState from 'utils/hooks/state/useTokenState';
import useUpdateAcademicInfo from 'pages/GraduationCalculatorPage/hooks/useUpdateAcademicInfo';
import { Selector } from 'components/common/Selector';
import styles from './StudentForm.module.scss';

function StudentForm() {
  const logger = useLogger();
  const token = useTokenState();
  const { data: academicInfo } = useUserAcademicInfo();
  const { data: deptMajorList } = useDepartmentMajorList();

  const [
    studentNumber, setStudentNumber,
  ] = useState<string>(academicInfo?.student_number ?? '');
  const [
    department, setDepartment,
  ] = useState<string>(academicInfo?.department ?? '');
  const [major, setMajor] = useState<string>(academicInfo?.major ?? '');
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

  const handleDepartment = ({ target }: { target: { value: string } }) => {
    logger.actionEventClick({
      actionTitle: 'USER',
      event_label: 'graduation_calculator_department',
      value: `학과 드롭다운_${target.value}`,
      event_category: 'click',
    });
    setDepartment(target.value);
    handleMajor(target.value);
    setMajor('');
  };

  const { mutate: updateAcademicInfo } = useUpdateAcademicInfo(token);

  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateAcademicInfo({
      student_number: studentNumber,
      department,
      major: major || undefined,
    });
  };

  useEffect(() => {
    if (academicInfo) {
      setStudentNumber(academicInfo.student_number);
      setDepartment(academicInfo.department);
      handleMajor(academicInfo.department);
      setMajor(academicInfo.major);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [academicInfo]);

  return (
    <form onSubmit={onSubmitForm} className={styles['student-form']}>
      <div className={styles['student-form__input']}>
        <div className={styles['student-form__input--text']}>내 정보</div>
        <button type="submit" className={styles['student-form__button']}>저장하기</button>
      </div>
      <div className={styles['student-form__input']}>
        <div className={styles['student-form__input--text']}>학번</div>
        <input
          name="student-number"
          className={styles['student-form__student-number']}
          value={studentNumber ?? ''}
          onChange={handleStudentNumber}
        />
      </div>
      <div className={styles['student-form__input']}>
        <div className={styles['student-form__input--text']}>학과</div>
        <div className={styles['student-form__department']}>
          <Selector
            options={departmentOptionList}
            value={department}
            onChange={handleDepartment}
            dropDownMaxHeight={475}
          />
        </div>
      </div>
      <div className={styles['student-form__input']}>
        <div className={styles['student-form__input--text']}>전공</div>
        <div className={styles['student-form__major']}>
          <Selector
            options={majorOptionList}
            value={major}
            onChange={({ target }) => setMajor(target.value)}
            placeholder={majorOptionList.length === 0 ? '-' : '전공'}
            disabled={majorOptionList.length === 0}
          />
        </div>
      </div>
    </form>
  );
}

export default StudentForm;
