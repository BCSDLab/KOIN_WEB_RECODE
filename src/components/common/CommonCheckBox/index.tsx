import React from 'react';
import { ReactComponent as NotCheck } from 'assets/svg/Review/report-item-circle.svg';
import { ReactComponent as Check } from 'assets/svg/Review/report-item-checked.svg';
import styes from './CheckBox.module.scss';

interface CadioBoxProps {
  value: string;
  name: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CheckBox({
  value, name, checked, onChange,
}: CadioBoxProps) {
  return (
    <div className={styes['check-box']}>
      <input
        type="checkbox"
        id={value}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={value}>
        {checked ? <Check /> : <NotCheck />}
      </label>
    </div>
  );
}
