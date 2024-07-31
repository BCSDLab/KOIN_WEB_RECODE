import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as gtag from 'lib/gtag';
import uuidv4 from 'utils/ts/uuidGenerater';
import { UserResponse } from 'api/auth/entity';
import { useUser } from 'utils/hooks/state/useUser';

const userUniqueIdGenerator = (userInfo: UserResponse | null | undefined) => {
  const uuid = localStorage.getItem('uuid') || uuidv4();
  localStorage.setItem('uuid', uuid);
  if (userInfo?.student_number) {
    return `${userInfo.student_number}-${uuid}`;
  }
  return uuid;
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
          gtag.pageView(window.location.pathname + window.location.search, userUniqueIdGenerator(userInfo));
          prevPathname.current = window.location.pathname;
        }, 1000);
      }
    };

    handlePageView();
  }, [location, userInfo]);

  return null;
}

export default LogPage;
