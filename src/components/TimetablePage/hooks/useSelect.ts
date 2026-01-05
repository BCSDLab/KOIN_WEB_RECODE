import React from 'react';

interface SelectTarget {
  value: string;
}

const useSelect = (initialValue?: string | null) => {
  const [value, setValue] = React.useState<string | null>(initialValue ?? null);

  const onChangeSelect = (e: { target: SelectTarget }) => {
    const { target } = e;
    setValue(target.value);
  };

  return {
    value,
    onChangeSelect,
  };
};

export default useSelect;
