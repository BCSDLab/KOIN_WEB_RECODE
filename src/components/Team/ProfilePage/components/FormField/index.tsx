import { useId, type ReactNode } from 'react';
import styles from './FormField.module.scss';

interface FormFieldChildProps {
  controlId: string;
  controlClassName: string;
  ariaDescribedBy?: string;
  ariaInvalid: boolean;
}

interface FormFieldProps {
  label: string;
  required?: boolean;
  description?: string;
  maxLength?: number;
  currentLength?: number;
  error?: string;
  /** 실제 input/textarea를 렌더한다. 라벨·오류와 연결할 속성을 인자로 전달받는다. */
  children: (props: FormFieldChildProps) => ReactNode;
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
  const controlId = useId();
  const errorId = `${controlId}-error`;

  return (
    <div className={styles.field}>
      <div className={styles.field__head}>
        <label className={styles.field__label} htmlFor={controlId}>
          {label}
          {required && <span className={styles['field__required']}>*</span>}
        </label>
        {maxLength !== undefined && (
          <span className={styles.field__counter}>
            {Math.min(currentLength, maxLength)}/{maxLength}
          </span>
        )}
      </div>
      {description && <p className={styles.field__description}>{description}</p>}
      {children({
        controlId,
        controlClassName: styles.field__control,
        ariaDescribedBy: error ? errorId : undefined,
        ariaInvalid: Boolean(error),
      })}
      {error && (
        <p className={styles.field__error} id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
}
