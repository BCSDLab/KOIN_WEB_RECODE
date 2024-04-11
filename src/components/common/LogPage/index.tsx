import React from 'react';
import * as gtag from 'lib/gtag';
import uuidv4 from 'utils/ts/uuidGenerater';
import { getCookie, setCookie } from 'utils/ts/cookie';
import { UserResponse } from 'api/auth/entity';
import { useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userInfoState } from 'utils/recoil/userInfoState';

const userUniqueIdGenerator = (userInfo: UserResponse | null | undefined) => {
  const uuid = getCookie('uuid') || uuidv4();
  setCookie('uuid', uuid, 30);
  if (userInfo?.student_number) {
    return `${userInfo.student_number}-${uuid}`;
  }
  return uuid;
};

function LogPage() {
  const location = useLocation();
  const userInfo = useRecoilValue(userInfoState);

  React.useEffect(() => {
    gtag.pageView(location.pathname + location.search, userUniqueIdGenerator(userInfo));
  }, [location, userInfo]);

  return null;
}

export default LogPage;
