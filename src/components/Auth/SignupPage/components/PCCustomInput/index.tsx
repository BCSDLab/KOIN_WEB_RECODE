import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@bcsdlab/utils';
import CloseIcon from 'assets/svg/Login/close.svg';
import CorrectIcon from 'assets/svg/Login/correct.svg';
import ErrorIcon from 'assets/svg/Login/error.svg';
import EyeCloseIcon from 'assets/svg/Login/eye-close.svg';
import EyeOpenIcon from 'assets/svg/Login/eye-open.svg';
import WarningIcon from 'assets/svg/Login/warning.svg';
import FormatTime from 'components/Auth/SignupPage/hooks/useFormatTime';
import { useFormContext } from 'react-hook-form';
import { UserType } from 'static/auth';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import styles from './PCCustomInput.module.scss';

export type InputMessage = {
  type: 'error' | 'warning' | 'success' | 'info' | 'default';
  content: string;
  code?: 'SMS_LIMIT' | 'ALREADY_REGISTERED' | string;
} | null;

interface PCCustomInputProps extends ComponentPropsWithoutRef<'input'> {
  htmlFor: string;
  labelName: string;
  placeholder?: string;
  type?: 'text' | 'password';
  message?: InputMessage | null;
  isDelete?: boolean;
  onClear?: () => void;
  isVisibleButton?: boolean;
  isTimer?: boolean;
  timerValue?: number;
  userType?: UserType;
  isRequired?: boolean;
  children?: React.ReactNode;
  forwardRef?: React.Ref<HTMLInputElement>;
}

const PCCustomInput = forwardRef<HTMLInputElement, PCCustomInputProps>(
  (
    {
      value,
      htmlFor,
      labelName,
      placeholder,
      type = 'text',
      message = null,
      isDelete = false,
      isVisibleButton = false,
      isTimer = false,
      timerValue = 180,
      userType,
      isRequired,
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
        <div className={styles['label-wrapper']}>
          <label htmlFor={htmlFor} className={styles['label-wrapper__label']}>
            {labelName}
            {isRequired && <span className={styles.required}>*</span>}
          </label>

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

              {isDelete && value && !args.disabled && (
                <button
                  type="button"
                  onClick={() => {
                    const emptyEvent = {
                      target: { value: '' },
                    } as React.ChangeEvent<HTMLInputElement>;
                    args.onChange?.(emptyEvent);
                    setValue(args.name!, '');
                    args.onClear?.();
                  }}
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
          </div>
        </div>
        <div>
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
      </div>
    );
  },
);

export default PCCustomInput;
