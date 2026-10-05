import useSession from 'utils/hooks/auth/useSession';

const useIsLoggedIn = () => useSession().status === 'authenticated';

export default useIsLoggedIn;
