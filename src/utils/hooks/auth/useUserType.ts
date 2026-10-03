import type { UserType } from 'utils/auth/session';

import useSession from './useSession';

const useUserType = (): UserType | null => {
  const session = useSession();

  return session.status === 'authenticated' ? session.userType : null;
};

export default useUserType;
