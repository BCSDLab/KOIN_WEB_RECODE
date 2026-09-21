import { useEffect } from 'react';

import { STORAGE_KEY, COMPLETION_STATUS } from 'static/auth';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';
import useMount from 'utils/hooks/state/useMount';
import { useUser } from 'utils/hooks/state/useUser';
import { useLocalStorage, useSessionStorage } from 'utils/hooks/state/useWebStorage';
import { isStudentUser } from 'utils/ts/userTypeGuards';

type Completion = (typeof COMPLETION_STATUS)[keyof typeof COMPLETION_STATUS];

export default function useUserInfoModal() {
  const isMounted = useMount();
  const isLoggedIn = useIsLoggedIn();
  const { data: userInfo } = useUser();

  const [completion, setCompletion] = useLocalStorage<Completion | null>(STORAGE_KEY.USER_INFO_COMPLETION, null);

  const [sessionShown, setSessionShown] = useSessionStorage<boolean>(STORAGE_KEY.MODAL_SESSION_SHOWN, false);

  const isStudent = isStudentUser(userInfo);

  const isInfoMissing = isStudent
    ? (['login_id', 'gender', 'major', 'name', 'phone_number', 'student_number'] as const).some((field) => {
        const v = userInfo[field];

        return v === undefined || v === null || v === '';
      })
    : false;

  const canOpen = isLoggedIn && isStudent && completion !== COMPLETION_STATUS.COMPLETED && isInfoMissing && !sessionShown;

  const isFirstTime = completion !== COMPLETION_STATUS.SKIPPED;
  // 서버와 브라우저의 첫 렌더를 동일하게 유지한 뒤 로그인 상태에 따라 모달을 표시합니다.
  const isModalOpen = isMounted && canOpen;
  const showCloseButton = canOpen ? !isFirstTime : false;

  useEffect(() => {
    if (!isLoggedIn || !isStudent) return;
    if (!isInfoMissing && completion !== COMPLETION_STATUS.COMPLETED) {
      setCompletion(COMPLETION_STATUS.COMPLETED);
    }
  }, [isLoggedIn, isStudent, isInfoMissing, completion, setCompletion]);

  const closeModal = () => {
    setSessionShown(true);
  };

  const handleSkipModal = () => {
    if (completion !== COMPLETION_STATUS.SKIPPED) {
      setCompletion(COMPLETION_STATUS.SKIPPED);
    }
    setSessionShown(true);
  };

  return {
    isModalOpen,
    showCloseButton,
    handleSkipModal,
    closeModal,
  };
}
