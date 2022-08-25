import React from 'react';
import { LoginResponse } from 'api/auth/entity';
import { tokenState } from 'utils/recoil';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { useRecoilState } from 'recoil';
import { setCookie } from 'utils/ts/cookie';
import * as api from 'api';
import sha256 from 'utils/ts/SHA-256';
import styles from './LoginPage.module.scss';

interface IClassUser {
  userId: HTMLInputElement | null
  password: HTMLInputElement | null
}

interface IsAutoLogin {
  isAutoLoginFlag: boolean
}

interface UserInfo {
  userId: string
  password: string
}

const emailLocalPartRegex = /^[a-z_0-9]{1,12}$/;

const useAutoLoginFlag = () => {
  const [isAutoLoginFlag, setIsAutoLoginFlag] = React.useState(false);
  const onToggleAutoLoginFlag = () => {
    setIsAutoLoginFlag(!isAutoLoginFlag);
  };
  return {
    isAutoLoginFlag,
    onToggleAutoLoginFlag,
  };
};

const useLogin = (state: IsAutoLogin) => {
  const [, setToken] = useRecoilState(tokenState);
  const navigate = useNavigate();
  const postLogin = useMutation(api.auth.default, {
    onSuccess: (data: LoginResponse) => {
      if (state.isAutoLoginFlag) {
        setCookie('AUTH_TOKEN_KEY', data.token, 3);
      } else {
        setCookie('AUTH_TOKEN_KEY', data.token, 0);
      }
      setToken(data.token);
      navigate('/');
    },
  });

  const useSubmit = async (userInfo: UserInfo) => {
    if (userInfo.userId === null) {
      // eslint-disable-next-line no-alert
      alert('계정을 입력해주세요');
      return;
    }
    if (userInfo.password === null) {
      // eslint-disable-next-line no-alert
      alert('비밀번호를 입력해주세요');
      return;
    }
    if (userInfo.userId.indexOf('@koreatech.ac.kr') !== -1) {
      // eslint-disable-next-line no-alert
      alert('계정명은 @koreatech.ac.kr을 빼고 입력해주세요.'); // 모든 alert는 Toast로 교체 예정
      return;
    }
    if (!emailLocalPartRegex.test(userInfo.userId)) {
      // eslint-disable-next-line no-alert
      alert('아우누리 계정 형식이 아닙니다.');
      return;
    }
    const hashedPassword = await sha256(userInfo.password);

    postLogin.mutate({
      portal_account: userInfo.userId,
      password: hashedPassword,
    });
  };
  return useSubmit;
};

function LoginPage() {
  const loginRef = React.useRef<IClassUser>({
    userId: null,
    password: null,
  });
  const {
    isAutoLoginFlag,
    onToggleAutoLoginFlag,
  } = useAutoLoginFlag();
  const submitLogin = useLogin({ isAutoLoginFlag });
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { userId, password } = loginRef.current;
    submitLogin({
      userId: userId!.value,
      password: password!.value,
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
          <input className={styles['auto-login__checkbox']} checked={isAutoLoginFlag} onChange={onToggleAutoLoginFlag} type="checkbox" id="autoLoginCheckBox" />
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
