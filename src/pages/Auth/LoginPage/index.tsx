import React from 'react';
import { Link } from 'react-router-dom';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useLogger from 'utils/hooks/analytics/useLogger';
import ROUTES from 'static/routes';
import styles from './LoginPage.module.scss';
import { useLogin } from './hooks/useLogin';

interface IClassUser {
  userId: HTMLInputElement | null;
  password: HTMLInputElement | null;
}

function LoginPage() {
  const loginRef = React.useRef<IClassUser>({
    userId: null,
    password: null,
  });
  const [isAutoLoginFlag, , , toggleIsAutoLoginFlag] = useBooleanState(false);
  const logger = useLogger();
  const submitLogin = useLogin({ isAutoLoginFlag });
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { userId, password } = loginRef.current;
    submitLogin({
      userId: userId ? userId.value : '',
      password: password ? password.value : '',
    });
  };

  return (
    <div className={styles.template}>
      <form className={styles.loginform} onSubmit={onSubmit}>
        <input
          ref={(inputRef) => {
            loginRef.current.userId = inputRef;
          }}
          className={styles['form-input']}
          autoComplete="username"
          name="userId"
          placeholder="아이디를 입력하세요"
        />
        <input
          ref={(inputRef) => {
            loginRef.current.password = inputRef;
          }}
          className={styles['form-input']}
          type="password"
          autoComplete="current-password"
          name="password"
          placeholder="비밀번호를 입력하세요"
        />
        <button
          type="submit"
          className={styles.loginform__button}
          onClick={() => {
            logger.actionEventClick({
              team: 'USER',
              event_label: 'login',
              value: '로그인완료',
            });
          }}
        >
          로그인
        </button>
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
      <div className={styles.help}>
        <a
          className={styles.help__link}
          href="https://portal.koreatech.ac.kr/kut/page/findUser.jsp"
          onClick={() => {
            logger.actionEventClick({
              team: 'USER',
              event_label: 'login',
              value: '아이디찾기',
            });
          }}
        >
          아이디 찾기
        </a>
        <Link
          className={styles.help__link}
          to={ROUTES.AuthFindPW()}
          onClick={() => {
            logger.actionEventClick({
              team: 'USER',
              event_label: 'login',
              value: '비밀번호찾기',
            });
          }}
        >
          비밀번호 찾기
        </Link>
        <Link
          className={styles.help__link}
          to={ROUTES.AuthSignup()}
          onClick={() => {
            logger.actionEventClick({
              team: 'USER',
              event_label: 'login',
              value: '회원가입',
            });
          }}
        >
          회원가입
        </Link>
      </div>
      <span className={styles.template__copyright}>
        COPYRIGHT ⓒ&nbsp;
        {new Date().getFullYear()}
        &nbsp;BY BCSDLab ALL RIGHTS RESERVED.
      </span>
    </div>
  );
}

export default LoginPage;
