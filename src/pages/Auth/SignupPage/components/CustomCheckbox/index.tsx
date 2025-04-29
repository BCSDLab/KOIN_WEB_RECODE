import { InputHTMLAttributes } from 'react';
import styles from './CustomCheckbox.module.scss';

type CustomCheckboxProps = InputHTMLAttributes<HTMLInputElement>;

export default function CustomCheckbox({ ...options }: CustomCheckboxProps) {
  return (
    <input type="checkbox" className={styles['terms-checkbox']} {...options} />
  );
}
