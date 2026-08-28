import type { ReactNode } from 'react';
import styles from './FormField.module.scss';

interface FormFieldProps {
  label: string;
  required?: boolean;
  description?: string;
  maxLength?: number;
  currentLength?: number;
  error?: string;
  /** 실제 input/textarea를 렌더한다. 인자로 전달되는 className을 컨트롤에 적용한다. */
  children: (controlClassName: string) => ReactNode;
}

export default function FormField({
  label,
  required = false,
  description,
  maxLength,
  currentLength = 0,
  error,
  children,
}: FormFieldProps) {
  return (
    <div className={styles.field}>
      <div className={styles.field__head}>
        <span className={styles.field__label}>
          {label}
          {required && <span className={styles['field__required']}>*</span>}
        </span>
        {maxLength !== undefined && (
          <span className={styles.field__counter}>
            {Math.min(currentLength, maxLength)}/{maxLength}
          </span>
        )}
      </div>
      {description && <p className={styles.field__description}>{description}</p>}
      {children(styles.field__control)}
      {error && <p className={styles.field__error}>{error}</p>}
    </div>
  );
}
