import React from 'react';

const useSearch = () => {
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const [currentValue, setCurrentValue] = React.useState<string | null>(null);
  const onClickSearchButton = () => {
    setCurrentValue(searchInputRef.current?.value ?? '');
  };
  const onKeyDownSearchInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') {
      return;
    }
    setCurrentValue(e.currentTarget.value);
  };

  return {
    value: currentValue,
    onClickSearchButton,
    searchInputRef,
    onKeyDownSearchInput,
  };
};

export default useSearch;
