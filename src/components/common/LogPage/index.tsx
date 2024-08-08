import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as gtag from 'lib/gtag';
import uuidv4 from 'utils/ts/uuidGenerater';
import { UserResponse } from 'api/auth/entity';
import { useUser } from 'utils/hooks/state/useUser';

const userUniqueIdGenerator = (userInfo: UserResponse | null | undefined) => {
  let uuid = localStorage.getItem('uuid');
  if (!uuid) {
    uuid = uuidv4();
    localStorage.setItem('uuid', uuid);
  }
  // student_number가 있는 경우, 기존 uuid를 확인하여 새로 저장
  if (userInfo?.student_number) {
    // 기존 uuid에서 student_number를 분리
    const existingUuid = uuid.split('-').pop();
    uuid = `${userInfo.student_number}-${existingUuid}`;
    localStorage.setItem('uuid', uuid);
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
