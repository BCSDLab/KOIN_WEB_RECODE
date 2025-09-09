import { useEffect, useRef } from 'react';
import * as gtag from 'lib/gtag';
import { UserResponse } from 'api/auth/entity';
import { useUser } from 'utils/hooks/state/useUser';
import { isStudentUser } from 'utils/ts/userTypeGuards';
import { isomorphicLocalStorage } from 'utils/ts/env';
import { useRouter } from 'next/router';

const userUniqueIdGenerator = (userInfo: UserResponse | null) => {
  if (!userInfo) {
    isomorphicLocalStorage.removeItem('uuid');
    return '';
  }

  const { id, student_number: studentNumber } = userInfo;
  const idString = String(id);

  if (id && studentNumber) {
    const newStudentNumber = studentNumber.slice(0, 6);
    const newUserId = `${newStudentNumber}-${idString}`;
    isomorphicLocalStorage.setItem('uuid', newUserId);

    return newUserId;
  }

  if (id && !studentNumber) {
    const newUserId = `anonymous_${idString}`;
    isomorphicLocalStorage.setItem('uuid', newUserId);

    return newUserId;
  }

  isomorphicLocalStorage.removeItem('uuid');
  return '';
};

export default function PageViewTracker() {
  const router = useRouter();
  const { data: userInfo } = useUser();
  const prevPathname = useRef('');

  const isStudent = userInfo && isStudentUser(userInfo);

  useEffect(() => {
    if (!isStudent) return;
    const currentPath = router.asPath;

    const handlePageView = () => {
      if (prevPathname.current !== currentPath) {
        setTimeout(() => {
          gtag.pageView(
            currentPath + window.location.search,
            userUniqueIdGenerator(userInfo) || '',
          );
          prevPathname.current = window.location.pathname;
        }, 1000);
      }
    };
    handlePageView();
  }, [router, userInfo, isStudent]);
  return null;
}
