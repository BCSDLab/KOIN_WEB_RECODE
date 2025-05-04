/* eslint-disable no-restricted-imports */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { ComponentPropsWithoutRef } from 'react';
import CloseIcon from 'assets/svg/Login/close.svg';
import EyeOpenIcon from 'assets/svg/Login/eye-open.svg';
import EyeCloseIcon from 'assets/svg/Login/eye-close.svg';
import ErrorIcon from 'assets/svg/Login/error.svg';
import CorrectIcon from 'assets/svg/Login/correct.svg';
import WarningIcon from 'assets/svg/Login/warning.svg';
import { useFormContext } from 'react-hook-form';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import FormatTime from 'pages/Auth/SignupPage/hooks/useFormatTime';
import { cn } from '@bcsdlab/utils';
import styles from './CustomInput.module.scss';

export type InputMessage = {
  type: 'error' | 'warning' | 'success' | 'info' | 'default';
  content: string;
} | null;

interface CustomInputProps extends ComponentPropsWithoutRef<'input'> {
  placeholder?: string;
  type?: 'text' | 'password';
  message?: InputMessage | null;
  isDelete?: boolean;
  isVisibleButton?: boolean;
  isTimer?: boolean;
  timerValue?: number;
  isButton?: boolean;
  buttonText?: string;
  buttonOnClick?: () => void;
  buttonDisabled?: boolean;
  children?: React.ReactNode;
}

function CustomInput({
  value,
  placeholder,
  type = 'text',
  message = null,
  isDelete = false,
  isVisibleButton = false,
  isTimer = false,
  timerValue = 180,
  isButton = false,
  buttonText = '',
  buttonOnClick,
  buttonDisabled,
  children,
  ...args
}: CustomInputProps) {
  const { setValue } = useFormContext();
  const [isPasswordVisible, , , togglePasswordVisible] = useBooleanState(false);

  const getInputType = (): 'text' | 'password' => {
    if (isVisibleButton && type === 'password') {
      return isPasswordVisible ? 'text' : 'password';
    }
    return type;
  };

  const inputType = getInputType();

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles['input-wrapper']}>

          <input
            className={styles['input-wrapper__input']}
            type={inputType}
            placeholder={placeholder}
            value={value}
            {...args}
          />

          {isTimer && (
          <span
            className={cn({
              [styles['input-wrapper__timer']]: true,
              [styles['input-wrapper__timer--active']]: isDelete && Boolean(value),
            })}
          >
            {FormatTime(timerValue)}
          </span>
          )}

          {isDelete && value && (
          <button
            type="button"
            onClick={() => setValue(args.name!, '')}
            className={styles['input-wrapper__optionButton']}
          >
            <CloseIcon />
          </button>
          )}

          {isVisibleButton && type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisible}
            className={styles['input-wrapper__optionButton']}
          >
            {isPasswordVisible ? <EyeOpenIcon /> : <EyeCloseIcon />}
          </button>
          )}
        </div>
        {isButton && (
          <button
            type="button"
            className={styles.button}
            onClick={buttonOnClick}
            disabled={
              buttonDisabled
              || (isTimer && FormatTime(timerValue) === '00:00')
            }
          >
            {buttonText}
          </button>
        )}
      </div>
      {message && (
      <div className={styles.messageWrapper}>
        {message.type === 'error' && <ErrorIcon />}
        {message.type === 'success' && <CorrectIcon />}
        {message.type === 'warning' && <WarningIcon />}
        <p className={`${styles.messageWrapper__message} ${styles[`messageWrapper__message--${message.type}`]}`}>
          {message.content}
        </p>
          {children}
      </div>
      )}

    </div>
  );
}

export default CustomInput;
