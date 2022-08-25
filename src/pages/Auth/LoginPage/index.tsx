import React from 'react';
import { Link } from 'react-router-dom';
import sha256 from 'utils/ts/SHA-256';
import useLogin from 'utils/hooks/useLogin';
import styles from './LoginPage.module.scss';

interface IClassUser {
  userId: HTMLInputElement | null
  password: HTMLInputElement | null
}

const emailLocalPartRegex = /^[a-z_0-9]{1,12}$/;

function LoginPage() {
  const loginRef = React.useRef<IClassUser>({
    userId: null,
    password: null,
  });
  const [isAutoLoginFlag, setIsAutoLoginFlag] = React.useState(false);
  const postLogin = useLogin({ isAutoLoginFlag });
  const onToggleAutoLoginFlag = () => {
    setIsAutoLoginFlag(!isAutoLoginFlag);
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { userId, password } = loginRef.current;
    if (userId === null) {
      return;
    }
    if (password === null) {
      return;
    }
    emailLocalPartRegex.test(userId.value);
    const hashedPassword = await sha256(password?.value);

    postLogin.mutate({
      portal_account: userId.value,
      password: hashedPassword,
    });
  };

  return (
    <div className={styles.template}>
      <form className={styles.loginform} onSubmit={onSubmit}>
        <input
          ref={(inputRef) => { loginRef.current.userId = inputRef; }}
          className={styles['form-input']}
          autoComplete="username"
          name="userId"
          placeholder="아이디를 입력하세요"
        />
        <input
          ref={(inputRef) => { loginRef.current.password = inputRef; }}
          className={styles['form-input']}
          type="password"
          autoComplete="current-password"
          name="password"
          placeholder="비밀번호를 입력하세요"
        />
        <button type="submit" className={styles.loginform__button}>
          로그인
        </button>
      </form>
      <div aria-hidden="true" className={styles['auto-login']}>
        <label className={styles['auto-login__label']} htmlFor="autoLoginCheckBox">
          <input className={styles['auto-login__input']} checked={isAutoLoginFlag} onChange={onToggleAutoLoginFlag} type="checkbox" id="autoLoginCheckBox" />
          <span className={styles['auto-login__checkbox']} />
          자동 로그인
        </label>
      </div>
      <div className={styles.help}>
        <a className={styles.help__finduser} href="https://portal.koreatech.ac.kr/kut/page/findUser.jsp">아이디 찾기</a>
        <Link className={styles.help__findpassword} to="/findpw">비밀번호 찾기</Link>
        <Link className={styles.help__signup} to="/signup">회원가입</Link>
      </div>
      <span className={styles.template__copyright}>
        COPYRIGHT ⓒ&nbsp;
        {
          new Date().getFullYear()
        }
        &nbsp;BY BCSDLab ALL RIGHTS RESERVED.
      </span>
    </div>
  );
}

export default LoginPage;
