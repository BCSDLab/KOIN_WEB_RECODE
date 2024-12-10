import { ChangeEvent, useState } from 'react';

const useIndexValueSelect = () => {
  const [selectedId, setSelectedId] = useState(0);

  const handleCourseChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedId(Number(e.target.value));
  };

  const reset = () => setSelectedId(0);

  return [selectedId, handleCourseChange, reset] as const;
};

export default useIndexValueSelect;
