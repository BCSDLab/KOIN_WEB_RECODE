import React from 'react';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useLogin } from 'pages/Auth/LoginPage/hooks/useLogin';
import BlindIcon from 'assets/svg/blind-icon.svg';
import ShowIcon from 'assets/svg/show-icon.svg';
import { cn } from '@bcsdlab/utils';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import { Link } from 'react-router-dom';
import ROUTES from 'static/routes';
import { useSessionLogger } from 'utils/hooks/analytics/useSessionLogger';
import styles from './LoginForm.module.scss';

interface IClassUser {
  userIdInput: HTMLInputElement | null;
  passwordInput: HTMLInputElement | null;
}

export default function LoginForm() {
  const [isPasswordVisible, , , toggleIsPasswordVisible] = useBooleanState(false);
  const [isAutoLoginFlag, , , toggleIsAutoLoginFlag] = useBooleanState(false);
  const sessionLogger = useSessionLogger();
  const isMobile = useMediaQuery();
  const submitLogin = useLogin({ isAutoLoginFlag });
  const loginRef = React.useRef<IClassUser>({
    userIdInput: null,
    passwordInput: null,
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { userIdInput, passwordInput } = loginRef.current;

    const userId = userIdInput ? userIdInput.value : '';
    const password = passwordInput ? passwordInput.value : '';

    submitLogin({ login_id: userId, login_pw: password });
  };

  return (
    <>
      <form className={styles.loginform} onSubmit={onSubmit}>
        <input
          ref={(inputRef) => {
            loginRef.current.userIdInput = inputRef;
          }}
          className={styles['form-input']}
          autoComplete="username"
          name="userId"
          placeholder="아이디(Koreatech ID/전화번호)"
        />
        <div className={styles['form-input-wrapper']}>
          <input
            ref={(inputRef) => {
              loginRef.current.passwordInput = inputRef;
            }}
            className={styles['form-input']}
            type={isPasswordVisible ? 'text' : 'password'}
            autoComplete="current-password"
            name="password"
            placeholder="비밀번호"
          />
          <button
            type="button"
            className={styles['password-toggle-button']}
            aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
            onClick={toggleIsPasswordVisible}
          >
            {isPasswordVisible ? <ShowIcon /> : <BlindIcon />}
          </button>
        </div>
        <button
          type="submit"
          className={cn({
            [styles.loginform__button]: true,
            [styles['loginform__first-button']]: true,
          })}
        >
          로그인
        </button>
        {isMobile && (
        <Link
          className={styles.loginform__button}
          to={ROUTES.AuthSignup({ currentStep: '약관동의', isLink: true })}
          onClick={() => {
            sessionLogger.actionSessionEvent({
              session_name: 'sign_up',
              event_label: 'start_sign_up',
              value: '회원가입 시작',
              event_category: 'click',
            });
          }}
        >
          회원가입
        </Link>
        )}
      </form>
      <div aria-hidden="true" className={styles['auto-login']}>
        <label className={styles['auto-login__label']} htmlFor="autoLoginCheckBox">
          <input
            className={styles['auto-login__checkbox']}
            checked={isAutoLoginFlag}
            onChange={toggleIsAutoLoginFlag}
            type="checkbox"
            id="autoLoginCheckBox"
          />
          자동 로그인
        </label>
      </div>
    </>
  );
}
