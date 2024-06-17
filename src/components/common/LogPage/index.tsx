import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import * as gtag from 'lib/gtag';
import { userInfoState } from 'utils/recoil/userInfoState';
import uuidv4 from 'utils/ts/uuidGenerater';
import { UserResponse } from 'api/auth/entity';

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
  const userInfo = useRecoilValue(userInfoState);
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
