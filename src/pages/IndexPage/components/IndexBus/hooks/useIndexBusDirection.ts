import { useState } from 'react';

const useIndexBusDirection = () => {
  const [toSchoolList, setToSchoolList] = useState([false, false, false]);

  const toggleDirection = (index: number) => {
    const newList = [...toSchoolList];
    newList[index] = !newList[index];
    setToSchoolList(newList);
  };

  return { toSchoolList, toggleDirection };
};

export default useIndexBusDirection;
