import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import * as gtag from 'lib/gtag';
import { UserResponse } from 'api/auth/entity';
import { useUser } from 'utils/hooks/state/useUser';

const userUniqueIdGenerator = (userInfo: UserResponse | null) => {
  if (!userInfo) {
    localStorage.removeItem('uuid');
    return '';
  }

  const { id, student_number: studentNumber } = userInfo;
  const idString = String(id);

  if (id && studentNumber) {
    const newStudentNumber = studentNumber.slice(0, 6);
    const newUserId = `${newStudentNumber}-${idString}`;
    localStorage.setItem('uuid', newUserId);

    return newUserId;
  }

  if (id && !studentNumber) {
    const newUserId = `anonymous_${idString}`;
    localStorage.setItem('uuid', newUserId);

    return newUserId;
  }

  localStorage.removeItem('uuid');
  return '';
};

export default function PageViewTracker() {
  const location = useLocation();
  const { data: userInfo } = useUser();
  const prevPathname = useRef('');

  useEffect(() => {
    const handlePageView = () => {
      if (prevPathname.current !== window.location.pathname) {
        setTimeout(() => {
          gtag.pageView(
            window.location.pathname + window.location.search,
            userUniqueIdGenerator(userInfo) || '',
          );
          prevPathname.current = window.location.pathname;
        }, 1000);
      }
    };
    handlePageView();
  }, [location, userInfo]);
  return null;
}
