import { useEffect } from 'react';
import { useTokenStore } from 'utils/zustand/auth';

const useTokenState = () => {
  const token = useTokenStore((state) => state.token);
  const refreshAccessToken = useTokenStore((state) => state.refreshAccessToken);
  useEffect(() => {
    if (!token) {
      refreshAccessToken();
    }
  }, [token, refreshAccessToken]);
  return token;
};

export default useTokenState;
