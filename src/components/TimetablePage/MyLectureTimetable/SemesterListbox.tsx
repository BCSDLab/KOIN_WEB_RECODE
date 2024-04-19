/* eslint-disable no-restricted-imports */
import React from 'react';
import { selectedSemesterAtom } from 'utils/recoil/semester';
import { useSelectRecoil } from '../hooks/useSelect';
import useSemesterOptionList from '../hooks/useSemesterOptionList';
import Listbox from '../Listbox';

function SemesterListbox() {
  const {
    value: semesterFilterValue,
    onChangeSelect: onChangeSemesterSelect,
  } = useSelectRecoil(selectedSemesterAtom);

  const semesterOptionList = useSemesterOptionList();
  React.useEffect(() => {
    onChangeSemesterSelect({ target: { value: semesterOptionList[0].value } });
  // onChange와 deptOptionList가 렌더링될 때마다 선언되서 처음 한번만 해야 하는 onChange를 렌더링할 때마다 한다.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Listbox
      list={semesterOptionList}
      value={semesterFilterValue}
      onChange={onChangeSemesterSelect}
    />
  );
}

export default SemesterListbox;
