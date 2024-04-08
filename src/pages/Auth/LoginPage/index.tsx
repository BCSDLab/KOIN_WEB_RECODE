import React from 'react';
import { LoginResponse } from 'api/auth/entity';
import { tokenState } from 'utils/recoil';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { setCookie } from 'utils/ts/cookie';
import useBooleanState from 'utils/hooks/useBooleanState';
import { auth } from 'api';
import sha256 from 'utils/ts/SHA-256';
import showToast from 'utils/ts/showToast';
import { isKoinError } from 'utils/ts/isKoinError';
import { sendClientError } from 'utils/ts/sendClientError';
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

const useLogin = (state: IsAutoLogin) => {
  const setToken = useSetRecoilState(tokenState);
  const navigate = useNavigate();
  const postLogin = useMutation(auth.login, {
    onSuccess: (data: LoginResponse) => {
      if (state.isAutoLoginFlag) {
        localStorage.setItem('AUTH_REFRESH_TOKEN_KEY', data.refresh_token);
        setCookie('AUTH_TOKEN_KEY', data.token, 3);
      } else {
        setCookie('AUTH_TOKEN_KEY', data.token, 0);
      }
      setToken(data.token);
      navigate('/');
    },
    onError: (error) => {
      if (isKoinError(error)) {
        // 추후에 코드별 에러 분기처리 진행
        showToast('error', error.message || '로그인에 실패했습니다.');
      } else {
        sendClientError(error);
        showToast('error', '로그인에 실패했습니다.');
      }
    },
  });

  const login = async (userInfo: UserInfo) => {
    if (userInfo.userId === '') {
      showToast('error', '계정을 입력해주세요');
      return;
    }
    if (userInfo.password === '') {
      showToast('error', '비밀번호를 입력해주세요');
      return;
    }
    if (userInfo.userId.indexOf('@koreatech.ac.kr') !== -1) {
      showToast('error', '계정명은 @koreatech.ac.kr을 빼고 입력해주세요.'); // 모든 alert는 Toast로 교체 예정
      return;
    }
    if (!emailLocalPartRegex.test(userInfo.userId)) {
      showToast('error', '아우누리 계정 형식이 아닙니다.');
      return;
    }
    const hashedPassword = await sha256(userInfo.password);

    postLogin.mutate({
      email: `${userInfo.userId}@koreatech.ac.kr`,
      password: hashedPassword,
    });
  };
  return login;
};

function LoginPage() {
  const loginRef = React.useRef<IClassUser>({
    userId: null,
    password: null,
  });
  const [isAutoLoginFlag, , , toggleIsAutoLoginFlag] = useBooleanState(false);
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
          <input className={styles['auto-login__checkbox']} checked={isAutoLoginFlag} onChange={toggleIsAutoLoginFlag} type="checkbox" id="autoLoginCheckBox" />
          자동 로그인
        </label>
      </div>
      <div className={styles.help}>
        <a className={styles.help__link} href="https://portal.koreatech.ac.kr/kut/page/findUser.jsp">아이디 찾기</a>
        <Link className={styles.help__link} to="/auth/findpw">비밀번호 찾기</Link>
        <Link className={styles.help__link} to="/auth/signup">회원가입</Link>
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
