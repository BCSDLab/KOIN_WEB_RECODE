import React from 'react';

const useSelect = (initialValue?: string | null) => {
  const [value, setValue] = React.useState<string | null>(initialValue ?? null);

  const onChangeSelect = (e: { target: any }) => {
    const { target } = e;
    setValue(target?.value);
  };

  return {
    value,
    onChangeSelect,
  };
};

export default useSelect;
