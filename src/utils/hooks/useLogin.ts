import { LoginResponse } from 'api/auth/entity';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { setCookie } from 'utils/ts/cookie';
import * as api from 'api';

interface State {
  isAutoLoginFlag: boolean
}

export default function useLogin(state : State) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const postLogin = useMutation(api.auth.default, {
    onSuccess: (data: LoginResponse) => {
      if (state.isAutoLoginFlag) {
        setCookie('AUTH_TOKEN_KEY', data.token, 3);
      } else {
        setCookie('AUTH_TOKEN_KEY', data.token, 0);
      }
      queryClient.invalidateQueries('postLogin');
      navigate('/');
    },
  });

  return postLogin;
}
