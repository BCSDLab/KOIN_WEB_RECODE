import React from 'react';
import * as gtag from 'lib/gtag';
import { useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userInfoState } from 'utils/recoil/userInfoState';

function LogPage() {
  const location = useLocation();
  const userInfo = useRecoilValue(userInfoState);

  React.useEffect(() => {
    gtag.pageView(location.pathname + location.search, userInfo?.student_number.slice(0, 6));
  }, [location, userInfo?.student_number]);

  return null;
}

export default LogPage;
