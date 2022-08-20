import { LoginResponse } from 'api/auth/entity';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import * as api from '../../api';

export default function useLogin() {
  const navigate = useNavigate();
  const postLogin = useMutation(api.auth.login, {
    onSuccess: (data: LoginResponse) => {
      localStorage.setItem('AUTH_TOKEN_KEY', data.token);
      navigate('/');
    },
  });

  return postLogin;
}
