/* eslint-disable no-restricted-imports */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { ComponentPropsWithoutRef, forwardRef } from 'react';
import CloseIcon from 'assets/svg/Login/close.svg';
import EyeOpenIcon from 'assets/svg/Login/eye-open.svg';
import EyeCloseIcon from 'assets/svg/Login/eye-close.svg';
import ErrorIcon from 'assets/svg/Login/error.svg';
import CorrectIcon from 'assets/svg/Login/correct.svg';
import WarningIcon from 'assets/svg/Login/warning.svg';
import { useFormContext } from 'react-hook-form';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import FormatTime from 'components/Auth/SignupPage/hooks/useFormatTime';
import { cn } from '@bcsdlab/utils';
import { UserType } from 'static/auth';
import styles from './CustomInput.module.scss';

export type InputMessage = {
  type: 'error' | 'warning' | 'success' | 'info' | 'default';
  content: string;
  code?: 'SMS_LIMIT' | 'ALREADY_REGISTERED' | string;
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
  userType?: UserType;
  children?: React.ReactNode;
  forwardRef?: React.Ref<HTMLInputElement>;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>((
  {
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
    userType,
    children,
    ...args
  },
  ref,
) => {
  const { setValue } = useFormContext();
  const [isPasswordVisible, , , togglePasswordVisible] = useBooleanState(false);

  const getInputType = (): 'text' | 'password' => {
    if (isVisibleButton && type === 'password') {
      return isPasswordVisible ? 'text' : 'password';
    }
    return type;
  };

  const inputType = getInputType();
  const isDomain = args.name === 'email' && userType === '학생';

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles['input-wrapper']}>

          <input
            ref={ref}
            className={cn({
              [styles['input-wrapper__input']]: true,
              [styles['input-wrapper__input--domain']]: isDomain,
              [styles['input-wrapper__input--button']]: Boolean(isDelete || isVisibleButton),
            })}
            type={inputType}
            placeholder={placeholder}
            value={value}
            {...args}
          />

          {args.name === 'email' && userType === '학생' && (
            <span className={styles['input-wrapper__email']}>@koreatech.ac.kr</span>
          )}

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
            tabIndex={-1}
          >
            <CloseIcon />
          </button>
          )}

          {isVisibleButton && type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisible}
            className={styles['input-wrapper__optionButton']}
            tabIndex={-1}
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
});

export default CustomInput;
