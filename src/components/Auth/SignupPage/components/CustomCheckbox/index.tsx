import { forwardRef, InputHTMLAttributes } from 'react';
import styles from './CustomCheckbox.module.scss';

type CustomCheckboxProps = InputHTMLAttributes<HTMLInputElement>;

const CustomCheckbox = forwardRef<HTMLInputElement, CustomCheckboxProps>(({ className, ...options }, ref) => (
  <input type="checkbox" className={`${styles['terms-checkbox']} ${className || ''}`} ref={ref} {...options} />
));

export default CustomCheckbox;
