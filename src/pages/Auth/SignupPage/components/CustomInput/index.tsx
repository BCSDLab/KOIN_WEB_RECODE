/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState } from 'react';
import CloseIcon from 'assets/svg/Login/close.svg';
import EyeOpenIcon from 'assets/svg/Login/eye-open.svg';
import EyeCloseIcon from 'assets/svg/Login/eye-close.svg';
import ErrorIcon from 'assets/svg/Login/error.svg';
import CorrectIcon from 'assets/svg/Login/correct.svg';
import WarningIcon from 'assets/svg/Login/warning.svg';
import styles from './CustomInput.module.scss';

interface CustomInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'password';
  message?: string;
  messageType?: 'error' | 'correct' | 'warning';
  isDeleteButton?: boolean;
  isVisibleButton?: boolean;
}

function CustomInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  message,
  messageType,
  isDeleteButton = false,
  isVisibleButton = false,
}: CustomInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleDelete = () => {
    onChange('');
  };

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

  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputWrapper}>
        <input
          className={styles.inputWrapper__input}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        {isDeleteButton && value && (
          <button type="button" onClick={handleDelete} className={styles.inputWrapper__optionButton}>
            <CloseIcon />
          </button>
        )}

        {isVisibleButton && type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={styles.inputWrapper__optionButton}
          >
            {isPasswordVisible ? <EyeCloseIcon /> : <EyeOpenIcon />}
          </button>
        )}

      </div>
      <div className={styles.messageWrapper}>
        {messageType === 'error' && <ErrorIcon />}
        {messageType === 'correct' && <CorrectIcon />}
        {messageType === 'warning' && <WarningIcon />}
        {message && (
        <p
          className={`
        ${styles.messageWrapper__message}
        ${messageType ? styles[`messageWrapper__message--${messageType}`] : ''}
      `}
        >

          {message}
        </p>
        )}

      </div>

    </div>
  );
}

export default CustomInput;
