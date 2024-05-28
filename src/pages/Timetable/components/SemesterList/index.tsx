/* eslint-disable no-restricted-imports */
import React, { useState } from 'react';
import { useSemester, useSemesterAction } from 'utils/zustand/semester';
import styles from './SemesterList.module.scss';
import useSemesterOptionList from '../../hooks/useSemesterOptionList';
import Listbox from '../../../../components/TimetablePage/Listbox';

function SemesterListbox() {
  const semester = useSemester();
  const { updateSemester } = useSemesterAction();
  const [value, setValue] = useState(semester);

  const onChangeSelect = (e: { target: { value: string } }) => {
    const { target } = e;
    updateSemester(target?.value);
    setValue(target?.value);
  };

  const semesterOptionList = useSemesterOptionList();
  React.useEffect(() => {
    onChangeSelect({ target: { value: semesterOptionList[0].value } });
  // onChange와 deptOptionList가 렌더링될 때마다 선언되서 처음 한번만 해야 하는 onChange를 렌더링할 때마다 한다.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={styles['semester-list']}>
      <Listbox
        list={semesterOptionList}
        value={value}
        onChange={onChangeSelect}
        version="new"
      />
    </div>
  );
}

export default SemesterListbox;
