import React from 'react';
import { RecoilState, useRecoilState } from 'recoil';

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

const useSelectRecoil = (atom: RecoilState<string>) => {
  const [value, setValue] = useRecoilState<string>(atom);

  const onChangeSelect = (event: { target: any }) => {
    const { target } = event;
    setValue(target?.value);
  };

  return {
    value,
    onChangeSelect,
  };
};

export {
  useSelect,
  useSelectRecoil,
};
