import { MouseEvent, useState } from 'react';

const useIndexValueSelect = () => {
  const [selectedId, setSelectedId] = useState(0);

  const handleCourseChange = (e: MouseEvent<HTMLButtonElement>) => {
    setSelectedId(Number(e.currentTarget.dataset.value));
  };

  const reset = () => setSelectedId(0);

  return [selectedId, handleCourseChange, reset] as const;
};

export default useIndexValueSelect;
