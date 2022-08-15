import React from 'react';
import LoginForm from 'components/Auth/LoginForm/LoginForm';
import styles from './LoginPage.module.scss';

function LoginPage() {
  const [loginInfo, setLoginInfo] = React.useState({
    userId: '',
    password: '',
  });
  const emailLocalPartRegex = React.useMemo(() => /^[a-z_0-9]{1,12}$/, []);
  const emailRef = React.useRef();
  const passwordRef = React.useRef();

  const onChange = React.useCallback((e: any) => {
    setLoginInfo({
      ...loginInfo,
      [e.target.name]: e.target.value,
    });
  }, [loginInfo]);

  const onSubmit = React.useCallback((e: any) => {
    e.preventDefault();
    const { userId, password } = loginInfo;
    if (!userId || !userId.length) {
      return;
    }
    if (!password || !password.length) {
      return;
    }
    if (userId.indexOf('@koreatech.ac.kr') !== -1) {
      return;
    }
    if (!emailLocalPartRegex.test(userId)) {
      console.log(emailLocalPartRegex);
    }
    /*
    TODO : 로그인 api 콜
    */
  }, [loginInfo, emailLocalPartRegex]);

  return (
    <div className={styles.template}>
      <LoginForm
        loginInfo={loginInfo}
        onChange={onChange}
        onSubmit={onSubmit}
        emailRef={emailRef}
        passwordRef={passwordRef}
      />
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
