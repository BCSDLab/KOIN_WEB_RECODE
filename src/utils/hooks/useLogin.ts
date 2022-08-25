import { LoginResponse } from 'api/auth/entity';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { setCookie } from 'utils/ts/cookie';
import { useRecoilState } from 'recoil';
import { tokenState } from 'utils/recoil';
import * as api from 'api';

interface State {
  isAutoLoginFlag: boolean
}

export default function useLogin(state : State) {
  const [token, setToken] = useRecoilState<string>(tokenState);
  const navigate = useNavigate();
  const postLogin = useMutation(api.auth.default, {
    onSuccess: (data: LoginResponse) => {
      if (state.isAutoLoginFlag) {
        setCookie('AUTH_TOKEN_KEY', data.token, 3);
      } else {
        setCookie('AUTH_TOKEN_KEY', data.token, 0);
      }
      setToken(data.token);
      console.log(token);
      navigate('/');
    },
  });

  return postLogin;
}
