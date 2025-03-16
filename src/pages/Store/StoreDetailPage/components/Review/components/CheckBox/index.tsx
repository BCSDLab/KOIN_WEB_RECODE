import React from 'react';
import NotCheck from 'assets/svg/Review/report-item-circle.svg';
import Check from 'assets/svg/Review/report-item-checked.svg';
import styles from './CheckBox.module.scss';

interface CheckBoxProps {
  value: string;
  name: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
}

export default function CheckBox({
  value, name, checked, onChange, children,
}: CheckBoxProps) {
  return (
    <div className={styles['check-box']}>
      <label htmlFor={value} className={styles['check-box__label']}>
        <input
          className={styles['check-box__input']}
          type="checkbox"
          id={value}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
        />
        {checked ? <Check /> : <NotCheck />}
        {children}
      </label>
    </div>
  );
}
