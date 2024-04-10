import { useEffect } from 'react';
import { useTokenStore } from 'utils/zustand';

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
