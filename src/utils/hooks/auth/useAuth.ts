import { useMutation } from '@tanstack/react-query';
import { refresh } from 'api/auth';
import { setCookie } from 'utils/ts/cookie';
import { useTokenStore } from 'utils/zustand/auth';

const useAuth = () => {
  const { setToken, setRefreshToken } = useTokenStore.getState();

  const getRefreshToken = () => {
    const refreshTokenStorage = localStorage.getItem('refresh-token-storage');
    return refreshTokenStorage && JSON.parse(refreshTokenStorage).refresh_token;
  };

  const { mutateAsync: refreshAccessToken } = useMutation({
    mutationFn: async ({ refresh_token }: { refresh_token: string }) => {
      const response = await refresh({ refresh_token });
      return response;
    },
    onSuccess: (response) => {
      setCookie('AUTH_TOKEN_KEY', response.token);
      setToken(response.token);
    },
    onError: () => {
      setToken('');
      setRefreshToken('');
    },
  });

  return {
    refreshAccessToken,
    getRefreshToken,
  };
};

export default useAuth;
