import { LoginResponse } from 'api/auth/entity';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { setCookie } from 'utils/ts/cookie';
import * as api from '../../api';

interface State {
  isAutoLoginFlag: boolean
}

export default function useLogin(state : State) {
  const navigate = useNavigate();
  const postLogin = useMutation(api.auth.login, {
    onSuccess: (data: LoginResponse) => {
      if (state.isAutoLoginFlag) {
        localStorage.setItem('AUTH_TOKEN_KEY', data.token);
      } else {
        setCookie('AUTH_TOKEN_KEY', data.token);
      }
      navigate('/');
    },
  });

  return postLogin;
}
