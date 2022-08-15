import React from 'react';
import styles from './input.module.scss';

type InputProps = {
  autoComplete : string
  value: any
  onChange: any
  name: any
  placeholder: any
};

function input(
  {
    autoComplete,
    value,
    onChange,
    name,
    placeholder,
  }: InputProps,
  ref
  : any,
) {
  return (
    <input
      className={styles.styledinput}
      ref={ref}
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
      name={name}
      placeholder={placeholder}
    />
  );
}

export default React.forwardRef(input);
