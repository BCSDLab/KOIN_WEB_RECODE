import { useMutation } from '@tanstack/react-query';
import { refresh } from 'api/auth';
import { setCookie } from 'utils/ts/cookie';
import { useTokenStore } from 'utils/zustand/auth';

const useAuth = () => useMutation({
  mutationFn: async ({ refresh_token }: { refresh_token: string }) => {
    const response = await refresh({ refresh_token });
    setCookie('AUTH_TOKEN_KEY', response.token);
    useTokenStore.getState().setToken(response.token);

    return response;
  },
  onError: () => {
    useTokenStore.getState().setToken('');
    useTokenStore.getState().setRefreshToken('');
  },
});

export default useAuth;
