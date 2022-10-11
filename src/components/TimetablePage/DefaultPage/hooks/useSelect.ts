import React from 'react';

const useSelect = () => {
  const [value, setValue] = React.useState<string | null>(null);

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
