/* eslint-disable jsx-a11y/control-has-associated-label */
import { ComponentPropsWithoutRef, useState } from 'react';
import CloseIcon from 'assets/svg/Login/close.svg';
import EyeOpenIcon from 'assets/svg/Login/eye-open.svg';
import EyeCloseIcon from 'assets/svg/Login/eye-close.svg';
import ErrorIcon from 'assets/svg/Login/error.svg';
import CorrectIcon from 'assets/svg/Login/correct.svg';
import WarningIcon from 'assets/svg/Login/warning.svg';
import { useFormContext } from 'react-hook-form';
import styles from './CustomInput.module.scss';

export type InputMessage = {
  type: 'error' | 'warning' | 'success' | 'info';
  content: string;
} | null;

interface CustomInputProps extends ComponentPropsWithoutRef<'input'> {
  placeholder?: string;
  type?: 'text' | 'password';
  message?: InputMessage;
  isDelete?: boolean;
  isVisibleButton?: boolean;
  isTimer?: boolean;
  timerValue?: number;
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
  ...etc
}: CustomInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { setValue } = useFormContext();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const getInputType = (): 'text' | 'password' => {
    if (isVisibleButton && type === 'password') {
      return isPasswordVisible ? 'text' : 'password';
    }
    return type;
  };

  const inputType = getInputType();

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputWrapper}>

        <input
          className={styles.inputWrapper__input}
          type={inputType}
          placeholder={placeholder}
          value={value}
          {...etc}
        />

        {isTimer && !timerValue && (
        <span className={styles.inputWrapper__timer}>
          {formatTime(timerValue)}
        </span>
        )}
        {isDelete && value && (
          <button
            type="button"
            onClick={() => setValue(etc.name!, '')}
            className={styles.inputWrapper__optionButton}
          >
            <CloseIcon />
          </button>
        )}

        {isVisibleButton && type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={styles.inputWrapper__optionButton}
          >
            {isPasswordVisible ? <EyeOpenIcon /> : <EyeCloseIcon />}
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
      </div>
      )}

    </div>
  );
}

export default CustomInput;
