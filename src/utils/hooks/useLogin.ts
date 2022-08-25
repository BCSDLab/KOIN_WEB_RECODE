import { LoginResponse } from 'api/auth/entity';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { setCookie } from 'utils/ts/cookie';
import { useRecoilState } from 'recoil';
import { tokenState } from 'utils/recoil';
import sha256 from 'utils/ts/SHA-256';
import * as api from 'api';

interface State {
  isAutoLoginFlag: boolean
}
interface UserInfo {
  userId: string
  password: string
}
const emailLocalPartRegex = /^[a-z_0-9]{1,12}$/;

export default function useLogin(state : State) {
  const [, setToken] = useRecoilState<string>(tokenState);
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

  const submitLogin = async (userInfo: UserInfo) => {
    if (userInfo.userId === null) {
      return;
    }
    if (userInfo.password === null) {
      return;
    }
    emailLocalPartRegex.test(userInfo.userId);
    const hashedPassword = await sha256(userInfo.password);

    postLogin.mutate({
      portal_account: userInfo.userId,
      password: hashedPassword,
    });
  };
  return submitLogin;
}
