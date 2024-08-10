import { useTokenStore } from 'utils/zustand/auth';

const useTokenState = () => {
  const { token } = useTokenStore();
  return token;
};

export default useTokenState;
