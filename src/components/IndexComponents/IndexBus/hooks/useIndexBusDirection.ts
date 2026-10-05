import { useState } from 'react';

const useIndexBusDirection = () => {
  const [toSchoolList, setToSchoolList] = useState([false, false, false]);

  const toggleDirection = (index: number) => {
    setToSchoolList((value) => {
      const newValue = [...value];
      newValue[index] = !value[index];
      return newValue;
    });
  };

  return { toSchoolList, toggleDirection };
};

export default useIndexBusDirection;
