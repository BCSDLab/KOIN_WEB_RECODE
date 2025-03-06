import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as gtag from 'lib/gtag';
import { UserResponse } from 'api/auth/entity';
import { useUser } from 'utils/hooks/state/useUser';

const userUniqueIdGenerator = (userInfo: UserResponse | null | undefined) => {
  if (userInfo?.id && userInfo?.student_number) {
    const id = String(userInfo.id);
    const studentNumber = userInfo?.student_number?.slice(0, 6);
    const userId = `${studentNumber}-${id}`;
    localStorage.setItem('uuid', userId);

    return userId;
  }

  if (userInfo?.id && !userInfo?.student_number) {
    const id = String(userInfo.id);
    const userId = `'anonymous_'${id}`;
    localStorage.setItem('uuid', userId);

    return userId;
  }

  localStorage.removeItem('uuid');
  return '';
};

function LogPage() {
  const location = useLocation();
  const { data: userInfo } = useUser();
  const prevPathname = React.useRef('');

  useEffect(() => {
    const handlePageView = () => {
      if (prevPathname.current !== window.location.pathname) {
        setTimeout(() => {
          // eslint-disable-next-line max-len
          gtag.pageView(
            window.location.pathname + window.location.search,
            userUniqueIdGenerator(userInfo),
          );
          prevPathname.current = window.location.pathname;
        }, 1000);
      }
    };
    handlePageView();
  }, [location, userInfo]);
  return null;
}
export default LogPage;
