/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LoginForm.module.scss';
import Input from '../Input';

type LoginFormProps = {
  loginInfo: any
  onChange: any
  onSubmit: any
  emailRef: any
  passwordRef: any
};

function LoginForm({
  loginInfo,
  onChange,
  onSubmit,
  emailRef,
  passwordRef,
}: LoginFormProps) {
  const emailValidate = (value: any) => value;
  const passwordValidate = (value: any) => value;
  const emailChange = (e: any) => {
    onChange(emailValidate(e));
  };
  const passwordChange = (e: any) => {
    onChange(passwordValidate(e));
  };

  React.useImperativeHandle(
    emailRef,
    () => ({
      emailValidate,
    }),
    [],
  );
  React.useImperativeHandle(
    passwordRef,
    () => ({
      emailValidate,
    }),
    [],
  );
  return (
    <>
      <form className={styles.loginform} onSubmit={onSubmit}>
        <Input
          ref={emailRef}
          autoComplete="username"
          name="userId"
          value={loginInfo.userId}
          onChange={emailChange}
          placeholder="아이디를 입력하세요"
        />
        <Input
          ref={passwordRef}
          autoComplete="current-password"
          name="password"
          value={loginInfo.password}
          onChange={passwordChange}
          placeholder="비밀번호를 입력하세요"
        />
        <button type="submit" className={styles.loginform__button}>
          로그인
        </button>
      </form>
      <div className={styles.autologin}>
        <input className={styles.autologin__checkbox} type="checkbox" id="autoLoginCheckBox" />
        <label className={styles.autologin__text} htmlFor="autoLoginCheckBox">자동 로그인</label>
      </div>
      <div className={styles.help}>
        <a className={styles.help__finduser} href="https://portal.koreatech.ac.kr/kut/page/findUser.jsp">아이디 찾기</a>
        <Link className={styles.help__findpassword} to="/findpw">비밀번호 찾기</Link>
        <Link className={styles.help__signup} to="/signup">회원가입</Link>
      </div>
    </>
  );
}

export default React.forwardRef(LoginForm);
